"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { format } from "date-fns";
import { FiArrowLeft, FiHeadphones, FiClock } from "react-icons/fi";

const formatDuration = (durationMs) => {
  if (!Number.isFinite(durationMs)) return "--";
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function PrayerRoomArchivePage() {
  const { isLoaded, isSignedIn } = useUser();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchArchive = async () => {
      try {
        const response = await fetch("/api/prayer-rooms");
        if (!response.ok) {
          throw new Error("Failed to load recordings");
        }
        const rooms = await response.json();
        const flattened = rooms
          .filter((room) => Array.isArray(room.recordings) && room.recordings.length)
          .flatMap((room) =>
            room.recordings.map((recording) => ({
              ...recording,
              roomTitle: room.title,
              roomId: room._id,
            }))
          )
          .sort((a, b) => {
            const startA = a.startedAt || a.createdAt;
            const startB = b.startedAt || b.createdAt;
            return new Date(startB) - new Date(startA);
          });
        setRecordings(flattened);
      } catch (archiveError) {
        console.error("Archive fetch failed", archiveError);
        setError(archiveError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArchive();
  }, [isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-[#FFC94A]" />
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Loading archive
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold">Members-only archive</h1>
          <p className="text-white/70">
            Please sign in to listen back to recorded prayer room sessions.
          </p>
          <SignInButton mode="modal" className="inline-flex justify-center rounded-full bg-[#FFC94A] px-6 py-3 font-semibold text-[#2B1B0F] shadow-lg shadow-[#FFC94A]/40">
            Sign in to continue
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-28 pb-16 px-4">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
              Prayer room archive
            </p>
            <h1 className="text-3xl font-semibold mt-2">
              Replay audio from recent sessions
            </h1>
            <p className="text-white/70">
              Access automatically recorded sessions to stay in sync with what
              God is doing across the Arise Deborah prayer rooms.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/prayer-rooms"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              <FiArrowLeft /> Back to rooms
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {recordings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
            <FiHeadphones size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="text-2xl font-semibold">No recordings yet</h3>
            <p className="mt-2 text-white/70">
              Audio archives will appear here after your next live session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {recordings.map((recording, index) => (
              <div
                key={`${recording.publicId || recording.url}-${index}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                      {recording.roomTitle}
                    </p>
                    <h3 className="text-2xl font-semibold">
                      {recording.startedAt
                        ? format(new Date(recording.startedAt), "PPP · p")
                        : "Session replay"}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm text-white/80">
                    <FiClock /> {formatDuration(recording.durationMs)}
                  </div>
                </div>
                <audio
                  controls
                  controlsList="nodownload noplaybackrate"
                  className="w-full"
                  src={recording.url}
                >
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-wrap gap-4 text-xs text-white/60">
                  <span>
                    Uploaded by: {recording.uploadedBy ? "member" : "system"}
                  </span>
                  <span>
                    Size: {recording.sizeBytes ? `${(recording.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "--"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
