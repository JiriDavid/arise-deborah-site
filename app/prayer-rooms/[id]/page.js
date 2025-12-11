"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  LiveKitRoom,
  VideoConference,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  Chat,
  useTracks,
  useRoomContext,
  GridLayout,
  ChatMessage,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, RoomEvent, ParticipantEvent } from "livekit-client";

function ParticipantTracker({ onParticipantsChange }) {
  const room = useRoomContext();

  useEffect(() => {
    if (!room) return;

    const updateParticipants = () => {
      const participants = new Set();

      // Add local participant
      if (room.localParticipant?.name) {
        participants.add(room.localParticipant.name);
      }

      // Add remote participants
      room.remoteParticipants.forEach((participant) => {
        if (participant.name) {
          participants.add(participant.name);
        }
      });

      onParticipantsChange(participants);
    };

    updateParticipants();

    // Listen for participant changes
    room.on("participantConnected", updateParticipants);
    room.on("participantDisconnected", updateParticipants);

    return () => {
      room.off("participantConnected", updateParticipants);
      room.off("participantDisconnected", updateParticipants);
    };
  }, [room, onParticipantsChange]);

  return null;
}

function VideoConferenceComponent() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  return (
    <div className="h-full w-full">
      <GridLayout tracks={tracks}>
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}

function PrayerRoomRecorder({ roomId, recordingConfig, onFinished }) {
  const room = useRoomContext();
  const recorderRef = useRef(null);
  const startedAtRef = useRef(null);
  const cleanupAudioRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [isConnected, setIsConnected] = useState(false);

  const recorderToken = recordingConfig?.token;
  const shouldRecord = Boolean(
    recordingConfig?.shouldRecord && recorderToken && roomId && room
  );

  useEffect(() => {
    if (!room) return;

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    // Set initial state
    setIsConnected(room.connectionState === "connected");

    // Listen for changes
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
    };
  }, [room]);

  const sendCancellation = useCallback(async () => {
    if (!roomId || !recorderToken) {
      console.warn("[Cancellation] Missing roomId or token");
      return;
    }
    console.log("[Cancellation] Sending cancellation request");
    try {
      const formData = new FormData();
      formData.append("recordingToken", recorderToken);
      formData.append("intent", "cancel");
      await fetch(`/api/prayer-rooms/${roomId}/recordings/upload`, {
        method: "POST",
        body: formData,
      });
      console.log("[Cancellation] Sent successfully");
    } catch (cancelError) {
      console.error("Failed to cancel recording token", cancelError);
    }
  }, [roomId, recorderToken]);

  const uploadRecording = useCallback(
    async (blob, durationMs) => {
      if (!roomId || !recorderToken) {
        console.error("[Upload] Missing roomId or recorderToken");
        return;
      }
      console.log(
        `[Upload] Starting upload: blob size=${
          blob.size
        }, durationMs=${durationMs}, token=${recorderToken?.slice?.(0, 8)}...`
      );
      const formData = new FormData();
      const filename = `prayer-room-${roomId}-${Date.now()}.webm`;
      formData.append("file", blob, filename);
      formData.append("recordingToken", recorderToken);
      const startedAt =
        startedAtRef.current ||
        (recordingConfig?.startedAt
          ? new Date(recordingConfig.startedAt)
          : new Date());
      formData.append("startedAt", startedAt.toISOString());
      formData.append("endedAt", new Date().toISOString());
      if (Number.isFinite(durationMs)) {
        formData.append("durationMs", String(Math.max(durationMs, 0)));
      }
      console.log(
        `[Upload] FormData prepared with file=${!!blob}, token=${recorderToken?.slice?.(
          0,
          8
        )}...`
      );
      const response = await fetch(
        `/api/prayer-rooms/${roomId}/recordings/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(`[Upload] Response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Upload] Response error text: ${errorText}`);
        throw new Error(
          `Upload failed with status ${response.status}: ${errorText}`
        );
      }
      console.log(`[Upload] Upload completed successfully`);
    },
    [roomId, recorderToken, recordingConfig?.startedAt]
  );

  useEffect(() => {
    if (!shouldRecord || !room || !isConnected) {
      console.log(
        "[Recorder] Skipping start (shouldRecord=%s, room=%s, connected=%s)",
        shouldRecord,
        !!room,
        isConnected
      );
      return undefined;
    }

    console.log(
      "[Recorder] Proceeding with recorder setup - connected and ready"
    );

    if (
      typeof window === "undefined" ||
      typeof window.MediaRecorder === "undefined"
    ) {
      console.warn("MediaRecorder API unavailable; cancelling recording");
      sendCancellation();
      return undefined;
    }

    const AudioContextCls = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCls) {
      console.warn("AudioContext unsupported; cancelling recording");
      sendCancellation();
      return undefined;
    }

    const audioContext = new AudioContextCls();
    const destination = audioContext.createMediaStreamDestination();
    const sources = new Map();
    const wiredParticipants = new Set();
    const participantHandlers = new Map();
    const publicationListeners = new Map();
    const chunks = [];
    let hasConnectedTracks = false;

    const disconnectAll = () => {
      sources.forEach((source) => source.disconnect());
      sources.clear();
      try {
        audioContext.close();
      } catch (err) {
        console.warn(
          "[Recorder] AudioContext close error (may already be closed):",
          err.message
        );
      }
    };
    cleanupAudioRef.current = disconnectAll;

    const isRecordableTrack = (track) => {
      if (!track) return false;
      if (
        track.source === Track.Source.Microphone ||
        track.source === Track.Source.ScreenShareAudio
      ) {
        return true;
      }
      return track.kind === Track.Kind.Audio;
    };

    const getPublicationKey = (publication) =>
      publication?.trackSid || publication?.sid || publication?.source;

    const addTrack = (track) => {
      if (!isRecordableTrack(track)) return;
      const mediaStreamTrack = track.mediaStreamTrack;
      if (!mediaStreamTrack) return;
      console.log(
        `[Recorder] Adding track: ${track.source || track.kind} (${track.sid})`
      );
      const stream = new MediaStream([mediaStreamTrack]);
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNode.connect(destination);
      sources.set(track.sid, sourceNode);
      hasConnectedTracks = true;
      console.log(`[Recorder] Track connected. Total sources: ${sources.size}`);
    };

    const removeTrack = (track) => {
      if (!track) return;
      const existing = sources.get(track.sid);
      if (existing) {
        existing.disconnect();
        sources.delete(track.sid);
      }
    };

    const handleTrackSubscribed = (track) => addTrack(track);
    const handleTrackUnsubscribed = (track) => removeTrack(track);
    const handleDisconnected = () => {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    };

    // Mirrors LiveKit JS guidance for mixing audio via TrackPublication subscriptions.
    const wirePublication = (publication) => {
      if (!publication) return;
      const key = getPublicationKey(publication);
      if (!key || publicationListeners.has(key)) {
        if (publication.track) {
          addTrack(publication.track);
        }
        return;
      }

      const onPublicationSubscribed = (track) => addTrack(track);
      const onPublicationUnsubscribed = (track) => removeTrack(track);
      publication.on("trackSubscribed", onPublicationSubscribed);
      publication.on("trackUnsubscribed", onPublicationUnsubscribed);
      publicationListeners.set(key, {
        publication,
        onPublicationSubscribed,
        onPublicationUnsubscribed,
      });

      if (publication.track) {
        addTrack(publication.track);
      }
    };

    const unwirePublication = (publication) => {
      if (!publication) return;
      const key = getPublicationKey(publication);
      const listeners = key ? publicationListeners.get(key) : null;
      if (!listeners) {
        if (publication.track) {
          removeTrack(publication.track);
        }
        return;
      }
      publication.off("trackSubscribed", listeners.onPublicationSubscribed);
      publication.off("trackUnsubscribed", listeners.onPublicationUnsubscribed);
      publicationListeners.delete(key);
      if (publication.track) {
        removeTrack(publication.track);
      }
    };

    const handleParticipantTrackUnpublished = (publication) => {
      unwirePublication(publication);
    };

    const wireParticipant = (participant) => {
      if (!participant || wiredParticipants.has(participant.sid)) {
        return;
      }

      console.log(
        `[Recorder] Wiring participant: ${participant.name} (${participant.sid}), audio publications: ${participant.audioTrackPublications.size}`
      );

      // Wire existing publications
      participant?.audioTrackPublications?.forEach((publication) => {
        console.log(
          `[Recorder] - Found audio publication: ${
            publication.source
          }, track: ${!!publication.track}, subscribed: ${
            publication.isSubscribed
          }`
        );
        wirePublication(publication);
      });

      // Handle new publications as they arrive
      const handleParticipantTrackPublishedLocal = (publication) => {
        console.log(
          `[Recorder] New track published from ${participant.name}: ${publication.source}`
        );
        wirePublication(publication);
        // For local participant, automatically subscribe to audio tracks
        if (
          participant === room.localParticipant &&
          publication.source === Track.Source.Microphone
        ) {
          console.log(
            `[Recorder] Local microphone published - auto-subscribing`
          );
          if (!publication.isSubscribed) {
            publication.setSubscribed(true);
          }
        }
      };

      participant.on(ParticipantEvent.TrackSubscribed, handleTrackSubscribed);
      participant.on(
        ParticipantEvent.TrackUnsubscribed,
        handleTrackUnsubscribed
      );
      participant.on(
        ParticipantEvent.TrackPublished,
        handleParticipantTrackPublishedLocal
      );
      participant.on(
        ParticipantEvent.TrackUnpublished,
        handleParticipantTrackUnpublished
      );
      participantHandlers.set(participant.sid, {
        handleParticipantTrackPublished: handleParticipantTrackPublishedLocal,
        handleParticipantTrackUnpublished,
      });
      wiredParticipants.add(participant.sid);
    };

    const unwireParticipant = (participant) => {
      if (!participant || !wiredParticipants.has(participant.sid)) {
        return;
      }
      participant.off(ParticipantEvent.TrackSubscribed, handleTrackSubscribed);
      participant.off(
        ParticipantEvent.TrackUnsubscribed,
        handleTrackUnsubscribed
      );
      const handlerSet = participantHandlers.get(participant.sid);
      if (handlerSet) {
        participant.off(
          ParticipantEvent.TrackPublished,
          handlerSet.handleParticipantTrackPublished
        );
        participant.off(
          ParticipantEvent.TrackUnpublished,
          handlerSet.handleParticipantTrackUnpublished
        );
        participantHandlers.delete(participant.sid);
      }
      participant?.audioTrackPublications?.forEach((publication) => {
        unwirePublication(publication);
      });
      wiredParticipants.delete(participant.sid);
    };

    wireParticipant(room.localParticipant);
    room.remoteParticipants.forEach((participant) =>
      wireParticipant(participant)
    );

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ParticipantConnected, wireParticipant);
    room.on(RoomEvent.ParticipantDisconnected, unwireParticipant);

    // Continuously check for and subscribe to audio tracks as they appear
    // This is especially important for local participant microphone that publishes after room connection
    let subscriptionLoopActive = true;
    let loopIterations = 0;
    const subscriptionLoop = async () => {
      while (subscriptionLoopActive) {
        try {
          loopIterations++;
          if (loopIterations <= 3 || loopIterations % 10 === 0) {
            console.log(
              `[Recorder] Subscription loop iteration ${loopIterations}, room connected: ${
                room.connectionState === "connected"
              }`
            );
          }
          const allParticipants = [
            room.localParticipant,
            ...room.remoteParticipants.values(),
          ];
          allParticipants.forEach((participant) => {
            if (!participant) return;
            const audioPublications = Array.from(
              participant.audioTrackPublications.values()
            );
            if (
              audioPublications.length > 0 &&
              (loopIterations <= 3 || loopIterations % 10 === 0)
            ) {
              console.log(
                `[Recorder] Found ${
                  audioPublications.length
                } audio publications from ${participant.name || "unknown"}`
              );
            }
            audioPublications.forEach((publication) => {
              if (publication && !publication.isSubscribed) {
                console.log(
                  `[Recorder] Auto-subscribing to audio: ${
                    publication.source
                  } from ${participant.name || "unknown"}`
                );
                publication.setSubscribed(true);
              }
            });
          });

          // Also add any existing tracks that are available
          allParticipants.forEach((participant) => {
            if (!participant) return;
            const audioPublications = Array.from(
              participant.audioTrackPublications.values()
            );
            audioPublications.forEach((publication) => {
              if (
                publication.track &&
                isRecordableTrack(publication.track) &&
                !sources.has(publication.track.sid)
              ) {
                console.log(
                  `[Recorder] Adding existing track: ${publication.track.source} from ${participant.name}`
                );
                addTrack(publication.track);
              }
            });
          });
        } catch (err) {
          console.error("[Recorder] Error in subscription loop:", err);
        }
        // Check every 500ms for new publications
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    subscriptionLoop();

    const destinationTracks = destination.stream.getAudioTracks();
    if (!destinationTracks.length) {
      console.warn(
        "Recorder destination has no audio tracks yet; waiting for LiveKit subscriptions."
      );
    }

    const preferredMimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
    ];
    const mimeType = preferredMimeTypes.find((type) =>
      window.MediaRecorder.isTypeSupported?.(type)
    );
    if (!mimeType) {
      console.warn(
        "MediaRecorder audio mime type unsupported; browser default container will be used."
      );
    }
    const recorder = new MediaRecorder(
      destination.stream,
      mimeType ? { mimeType } : undefined
    );
    recorderRef.current = recorder;
    const startedAt = recordingConfig?.startedAt
      ? new Date(recordingConfig.startedAt)
      : new Date();
    startedAtRef.current = startedAt;
    setStatus("recording");

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log(
          `[Recorder] Data chunk received: ${
            event.data.size
          } bytes (total chunks: ${chunks.length + 1})`
        );
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      try {
        console.log(`[Recorder] Stop triggered with ${chunks.length} chunks`);
        if (!chunks.length) {
          console.warn("[Recorder] No chunks collected - cancelling recording");
          await sendCancellation();
          return;
        }
        const durationMs = Date.now() - startedAt.getTime();
        console.log(
          `[Recorder] Creating blob from ${chunks.length} chunks, duration: ${durationMs}ms`
        );
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log(
          `[Recorder] Blob created: ${blob.size} bytes, uploading...`
        );
        await uploadRecording(blob, durationMs);
        console.log(`[Recorder] Upload succeeded`);
        setStatus("uploaded");
        onFinished?.();
      } catch (uploadError) {
        console.error("[Recorder] Recording upload failed:", uploadError);
        console.log("[Recorder] Sending cancellation due to upload error");
        await sendCancellation();
        setStatus("error");
      } finally {
        disconnectAll();
      }
    };

    // Wait for at least one audio track to be wired before starting recorder
    const startRecorder = async () => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds at 100ms intervals
      while (!hasConnectedTracks && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
      if (!hasConnectedTracks && attempts >= maxAttempts) {
        console.warn(
          "[Recorder] No audio tracks connected after 5 seconds, starting anyway"
        );
      }
      if (recorder.state === "inactive") {
        console.log(
          `[Recorder] Starting with ${sources.size} audio source(s) connected`
        );
        recorder.start(5000);
      }
    };

    startRecorder();

    return () => {
      subscriptionLoopActive = false;
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ParticipantConnected, wireParticipant);
      room.off(RoomEvent.ParticipantDisconnected, unwireParticipant);

      const participantSids = Array.from(wiredParticipants);
      participantSids.forEach((participantSid) => {
        const participant =
          participantSid === room.localParticipant?.sid
            ? room.localParticipant
            : room.remoteParticipants.get(participantSid);
        if (participant) {
          unwireParticipant(participant);
        }
      });
      wiredParticipants.clear();
      const publicationEntries = Array.from(publicationListeners.values());
      publicationEntries.forEach(({ publication }) => {
        unwirePublication(publication);
      });
      publicationListeners.clear();

      if (recorder.state !== "inactive") {
        recorder.stop();
      } else {
        disconnectAll();
      }
    };
  }, [
    room,
    shouldRecord,
    isConnected,
    recordingConfig,
    uploadRecording,
    sendCancellation,
    onFinished,
  ]);

  useEffect(() => () => cleanupAudioRef.current?.(), []);

  if (status !== "recording") {
    return status === "uploaded" ? (
      <div className="pointer-events-none fixed bottom-24 right-4 z-40 rounded-full border border-white/20 bg-green-600/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-green-900/40">
        Uploaded
      </div>
    ) : status === "error" ? (
      <div className="pointer-events-none fixed bottom-24 right-4 z-40 rounded-full border border-white/20 bg-red-700/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-red-900/40">
        Recording Error
      </div>
    ) : null;
  }

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-40 rounded-full border border-white/20 bg-red-600/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-red-900/40">
      Recording
    </div>
  );
}

export default function PrayerRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [recordingAssignment, setRecordingAssignment] = useState(null);
  const [pinnedPrayers, setPinnedPrayers] = useState(new Set());
  const [messageReactions, setMessageReactions] = useState({});
  const [onlineParticipants, setOnlineParticipants] = useState(new Set());
  const autoRecordEnabled = room ? room.autoRecordAudio !== false : false;

  const scheduleDetails = () => {
    if (room?.isRecurringDaily) {
      const dailyWindow = `${room?.scheduledStartTime || "--:--"} - ${
        room?.scheduledEndTime || "--:--"
      }`;
      return {
        dateLabel: "Available Daily",
        timeLabel: `Daily • ${dailyWindow} (local time)`,
      };
    }

    if (!room?.date) {
      return { dateLabel: "TBD", timeLabel: "Awaiting schedule" };
    }

    const date = new Date(room.date);
    const dateLabel = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const timeLabel = `${room.scheduledStartTime || "--:--"} - ${
      room.scheduledEndTime || "--:--"
    } (local time)`;

    return { dateLabel, timeLabel };
  };

  const { dateLabel, timeLabel } = scheduleDetails();

  useEffect(() => {
    if (params.id) {
      fetchRoomDetails();
    }
  }, [params.id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`/api/prayer-rooms/${params.id}`);
      if (response.ok) {
        const roomData = await response.json();
        setRoom(roomData);
      } else {
        setError("Room not found");
      }
    } catch (error) {
      console.error("Failed to fetch room:", error);
      setError("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      const response = await fetch(`/api/prayer-rooms/${params.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.firstName + " " + user.lastName || "Anonymous",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token received:", data);
        setToken(data.token);
        setRecordingAssignment(data.recording || { shouldRecord: false });
      } else {
        console.error("Join room failed - response status:", response.status);
        console.error(
          "Join room failed - response headers:",
          Object.fromEntries(response.headers.entries())
        );
        try {
          const errorData = await response.json();
          console.error("Join room failed - error data:", errorData);
          setError(
            errorData.error || `Failed to join room (${response.status})`
          );
        } catch (jsonError) {
          console.error(
            "Join room failed - could not parse error response:",
            jsonError
          );
          const textResponse = await response.text();
          console.error("Join room failed - raw response:", textResponse);
          setError(
            `Failed to join room (${response.status}): ${
              textResponse || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Failed to join room:", error);
      setError("Failed to join room");
    } finally {
      setIsConnecting(false);
    }
  };

  const exitRoom = (destination = "/prayer-rooms") => {
    console.log(
      "Leaving room - clearing token and redirecting to",
      destination
    );
    setToken("");
    setRecordingAssignment(null);
    router.push(destination);
  };

  const handleLeaveRoom = () => exitRoom("/prayer-rooms");

  const handleDisconnected = (reason) => {
    console.log("LiveKit disconnected with reason:", reason);
    // Don't auto-redirect, show error instead
    setError(`Connection lost: ${reason || "Unknown reason"}`);
    setToken(""); // Clear token to show join screen again
  };

  const messageFormatter = (message) => {
    // LiveKit Chat passes the message as a string directly, not an object
    const messageText =
      typeof message === "string"
        ? message
        : message?.message || message?.text || String(message);

    if (!messageText) {
      return undefined;
    }

    return (
      <div className="flex flex-col gap-1 mb-4 px-2">
        <div className="text-sm text-red-400 bg-red-900/30 rounded px-3 py-2 break-words">
          {messageText}
        </div>
      </div>
    );
  };

  const handleRecordingFinished = () => {
    setRecordingAssignment((prev) =>
      prev ? { ...prev, shouldRecord: false } : prev
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC94A] mx-auto mb-4"></div>
          <p>Preparing your prayer room...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white/5 backdrop-blur-xl border border-[#FFC94A]/30 rounded-2xl p-10 max-w-lg w-full text-white">
          <h1 className="text-3xl font-bold text-[#FFC94A] mb-4">
            We hit a snag
          </h1>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/prayer-rooms")}
              className="bg-[#FFC94A] text-[#2B1B0F] px-6 py-3 rounded-xl font-semibold hover:bg-[#ffd778] transition"
            >
              Back to Prayer Rooms
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-white/80 hover:text-white text-sm"
            >
              Return to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="relative min-h-screen  text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 from-[#160a05] via-transparent to-[#050203]" />
        <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] bg-[#FFC94A]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-[#C08B5C]/10 blur-3xl rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-0 py-10 space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#FFC94A]/80">
                Live Group Prayer
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
                {room?.title || "Prayer Gathering"}
              </h1>
              {room?.isRecurringDaily && (
                <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full bg-purple-200/20 text-purple-100 text-xs font-semibold">
                  Daily Prayer Window
                </span>
              )}
              <p className="text-white/70 mt-2 max-w-2xl">
                {room?.description ||
                  "Join the community in a moment of united prayer and encouragement."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/prayer-rooms")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition"
              >
                ← Back to Rooms
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC94A] text-[#2B1B0F] font-semibold shadow-lg shadow-[#FFC94A]/30 hover:bg-[#ffd778] transition"
              >
                Return Home
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.25fr,0.75fr]">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-white/60 text-sm">Date</p>
                  <p className="text-xl font-semibold">{dateLabel}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Time</p>
                  <p className="text-xl font-semibold">{timeLabel}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Capacity</p>
                  <p className="text-xl font-semibold">
                    {room?.maxParticipants || 50} guests
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl  border border-white/5">
                  <p className="text-sm text-white/60">Focus</p>
                  <p className="text-lg font-semibold capitalize">
                    {room?.tags?.[0] || "Community"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                  <p className="text-sm text-white/60">Host</p>
                  <p className="text-lg font-semibold">Arise Deborah Team</p>
                </div>
              </div>

              {room?.isRecurringDaily && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-400/30">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-200">
                    Daily
                  </span>
                  <p className="text-sm text-white/80">
                    This room automatically reopens every day during the hours
                    listed above.
                  </p>
                </div>
              )}

              {autoRecordEnabled && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <p className="text-sm text-white/80">
                    Sessions are archived automatically as audio for members.
                  </p>
                </div>
              )}
            </section>

            <section className="bg-white text-gray-900 rounded-3xl shadow-2xl shadow-[#FFC94A]/20 p-8 flex flex-col gap-6">
              <div>
                <p className="text-sm font-medium text-[#C08B5C] uppercase tracking-[0.2em]">
                  Ready to join?
                </p>
                <h3 className="text-2xl font-semibold mt-2">
                  Step into the room
                </h3>
                <p className="text-gray-600 mt-2">
                  Sign in with your Arise Deborah account to gain secure access
                  to our LiveKit conference room.
                </p>
              </div>

              <button
                onClick={joinRoom}
                disabled={isConnecting}
                className="w-full bg-[#2B1B0F] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#432916] disabled:opacity-60 flex items-center justify-center gap-2 transition"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </>
                ) : (
                  "Join Prayer Session"
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                Having trouble?
                <button
                  onClick={() => router.push("/contact")}
                  className="ml-1 text-[#C08B5C] hover:text-[#a87249] underline"
                >
                  Contact support
                </button>
              </div>
            </section>
          </div>
        </div>

        {showSignInModal && (
          <div className="fixed inset-0  flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sign In Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please sign in to join this prayer session.
                </p>
                <div className="space-y-4">
                  <SignInButton
                    mode="modal"
                    redirectUrl={`/prayer-rooms/${params.id}`}
                    className="w-full bg-[#2B1B0F] text-white py-2 px-4 rounded-lg hover:bg-[#432916]"
                  >
                    Sign In
                  </SignInButton>
                  <div className="text-center text-sm text-gray-600">
                    <span className="mr-1">New here?</span>
                    <SignUpButton
                      mode="modal"
                      redirectUrl={`/prayer-rooms/${params.id}`}
                      className="text-[#C08B5C] font-semibold hover:underline"
                    >
                      Create an account
                    </SignUpButton>
                  </div>
                </div>
                <button
                  onClick={() => setShowSignInModal(false)}
                  className="mt-6 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Live Session
          </p>
          <h2 className="text-2xl font-semibold mt-2">{room?.title}</h2>
          <p className="text-white/70 text-sm">
            {dateLabel} · {timeLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exitRoom("/prayer-rooms")}
            className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition"
          >
            ← Back to Rooms
          </button>
          <button
            onClick={() => exitRoom("/")}
            className="px-4 py-2 rounded-full bg-[#FFC94A] text-[#2B1B0F] font-semibold shadow-lg shadow-[#FFC94A]/30 hover:bg-[#ffd778] transition"
          >
            Return Home
          </button>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow-lg shadow-red-900/40 hover:bg-red-500 transition"
          >
            Leave Session
          </button>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {autoRecordEnabled && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <span className="font-semibold text-red-300 mr-2">●</span>
            Audio archive enabled — this session is stored for members.
          </div>
        )}
        {recordingAssignment?.shouldRecord && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            You are the active recorder. Keep this tab open until the session
            ends so the audio archive uploads automatically.
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-80px)] flex flex-col">
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          connect={true}
          onDisconnected={handleDisconnected}
          onConnected={() => console.log("LiveKit connected successfully")}
          onError={(error) => {
            console.error("LiveKit connection error:", error);
            console.error("Error details:", {
              message: error.message,
              name: error.name,
              stack: error.stack,
            });
            setError(
              `Connection failed: ${
                error.message || "Unknown connection error"
              }`
            );
            setToken("");
          }}
          className="h-full w-full flex flex-col"
        >
          <ParticipantTracker onParticipantsChange={setOnlineParticipants} />

          {/* Main Content Area - Google Meet Style */}
          <div className="flex-1 flex min-h-0">
            {/* Video Grid Area */}
            <div className="flex-1 bg-[#202124] p-2 min-h-0">
              <div className="h-full rounded-lg overflow-hidden">
                <VideoConferenceComponent />
              </div>
            </div>

            {/* Chat Sidebar - Google Meet Style */}
            <div className="w-[360px] hidden lg:flex flex-col bg-[#202124] border-l border-[#3c4043]">
              {/* Chat Header */}
              <div className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-[#3c4043]">
                <h3 className="text-base font-medium text-white">
                  In-call messages
                </h3>
                <button className="p-2 hover:bg-[#3c4043] rounded-full transition">
                  <svg
                    className="w-5 h-5 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Participants Count */}
              <div className="flex-shrink-0 px-4 py-3 border-b border-[#3c4043]">
                <div className="flex items-center gap-2 text-sm text-[#9aa0a6]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>
                    {onlineParticipants.size} participant
                    {onlineParticipants.size !== 1 ? "s" : ""}
                  </span>
                </div>
                {onlineParticipants.size > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.from(onlineParticipants)
                      .slice(0, 4)
                      .map((participant, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#3c4043] text-[#e8eaed] px-2 py-1 rounded-full truncate max-w-[80px]"
                        >
                          {participant}
                        </span>
                      ))}
                    {onlineParticipants.size > 4 && (
                      <span className="text-xs text-[#9aa0a6] px-2 py-1">
                        +{onlineParticipants.size - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3">
                <Chat messageFormatter={messageFormatter} />
              </div>

              {/* Info Footer */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-[#3c4043]">
                <p className="text-xs text-[#9aa0a6] text-center">
                  Messages can only be seen by people in the call
                </p>
              </div>
            </div>
          </div>

          {/* Control Bar - Google Meet Style (Centered) */}
          <div className="flex-shrink-0 h-20 bg-[#202124] flex items-center justify-center px-4 relative">
            {/* Left - Meeting Info */}
            <div className="absolute left-4 text-sm text-[#9aa0a6] hidden md:block">
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>

            {/* Center - Controls */}
            <div className="flex items-center gap-3">
              <ControlBar />
            </div>

            {/* Right - End Call */}
            <div className="absolute right-4">
              <button
                onClick={handleLeaveRoom}
                className="bg-[#ea4335] hover:bg-[#d93025] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                </svg>
                Leave
              </button>
            </div>
          </div>

          <PrayerRoomRecorder
            roomId={room?._id}
            recordingConfig={recordingAssignment}
            onFinished={handleRecordingFinished}
          />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
