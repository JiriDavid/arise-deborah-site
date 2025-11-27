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
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

function VideoConferenceComponent() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  return (
    <div className="h-full w-full">
      <VideoConference />
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

  const handleLeaveRoom = () => {
    console.log("Leaving room - clearing token and redirecting");
    setToken("");
    router.push("/prayer-rooms");
  };

  const handleDisconnected = (reason) => {
    console.log("LiveKit disconnected with reason:", reason);
    // Don't auto-redirect, show error instead
    setError(`Connection lost: ${reason || "Unknown reason"}`);
    setToken(""); // Clear token to show join screen again
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading prayer room...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-accent mb-6">{error}</p>
          <button
            onClick={() => router.push("/prayer-rooms")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Back to Prayer Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-tertiary mb-2">
              {room?.title}
            </h1>
            <p className="text-accent">{room?.description}</p>
          </div>

          <button
            onClick={joinRoom}
            disabled={isConnecting}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <button
            onClick={() => router.push("/prayer-rooms")}
            className="w-full mt-4 text-accent hover:text-primary"
          >
            Back to Prayer Rooms
          </button>
        </div>

        {/* Sign In Modal */}
        {showSignInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="b rounded-xl shadow-lg p-8 max-w-sm w-full mx-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-tertiary mb-4">
                  Sign In Required
                </h3>
                <p className="text-accent mb-6">
                  Please sign in to join this prayer session.
                </p>
                <div className="space-y-4">
                  <SignInButton
                    mode="modal"
                    redirectUrl={`/prayer-rooms/${params.id}`}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
                  >
                    Sign In
                  </SignInButton>
                  <div className="text-center">
                    <span className="text-accent">Don't have an account? </span>
                    <SignUpButton
                      mode="modal"
                      redirectUrl={`/prayer-rooms/${params.id}`}
                      className="text-primary hover:underline"
                    >
                      Sign Up
                    </SignUpButton>
                  </div>
                </div>
                <button
                  onClick={() => setShowSignInModal(false)}
                  className="mt-4 text-accent hover:text-primary"
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
    <div className="h-screen w-full bg-gray-900">
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
            `Connection failed: ${error.message || "Unknown connection error"}`
          );
          setToken("");
        }}
        className="h-full w-full"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 p-4 flex justify-between items-center">
            <div>
              <h1 className="text-white text-xl font-semibold">
                {room?.title}
              </h1>
              <p className="text-gray-300 text-sm">{room?.description}</p>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Leave Room
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Video Area */}
            <div className="flex-1">
              <VideoConferenceComponent />
            </div>

            {/* Chat Sidebar */}
            <div className="w-80 bg-gray-800 border-l border-gray-700">
              <Chat />
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <ControlBar />
          </div>
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
