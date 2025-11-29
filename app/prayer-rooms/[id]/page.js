"use client";

import { useState, useEffect } from "react";
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
import { Track } from "livekit-client";

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
    router.push(destination);
  };

  const handleLeaveRoom = () => exitRoom("/prayer-rooms");

  const handleDisconnected = (reason) => {
    console.log("LiveKit disconnected with reason:", reason);
    // Don't auto-redirect, show error instead
    setError(`Connection lost: ${reason || "Unknown reason"}`);
    setToken(""); // Clear token to show join screen again
  };

  const messageFormatter = (message) => (
    <div className="flex justify-start mb-2">
      <div className="bg-white/10 text-white px-4 py-2 rounded-2xl max-w-xs">
        <div className="text-sm">{message.message}</div>
        <div className="text-xs text-white/70 mt-1">{message.from?.name || 'Anonymous'}</div>
      </div>
    </div>
  );

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

      <div className="px-4 pb-6 h-[calc(100vh-150px)]">
        <div className="relative h-full rounded-3xl border border-white/10  backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="pointer-events-none absolute left-6 top-6 z-10 hidden max-w-lg flex-col gap-1 rounded-2xl bg-black/40 px-4 py-3 md:flex">
            {/* <span className="text-xs uppercase tracking-[0.35em] text-white/70">
              Now streaming
            </span>
            <p className="text-lg font-semibold">{room?.title}</p>
            <p className="text-sm text-white/70 line-clamp-2">
              {room?.description}
            </p> */}
          </div>
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
            className="h-full w-full"
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col lg:flex-row">
                <div className="flex-1">
                  <VideoConferenceComponent />
                </div>
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 lg:relative pb-20 lg:pb-0">
                  <h3 className="text-lg font-semibold text-white mb-2 pt-4 px-4 lg:px-0 lg:ml-4">
                    Messages
                  </h3>
                  <Chat messageFormatter={messageFormatter} />
                </div>
              </div>
            </div>

            {/* Fixed ControlBar for all devices */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 px-4 py-3 z-50">
              <ControlBar />
            </div>

            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      </div>
    </div>
  );
}
