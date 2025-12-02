import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import PrayerRoom from "@/app/models/PrayerRoom";
import cloudinary from "@/app/lib/cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey =
  process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

const uploadBufferToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "prayer-room-archive",
        resource_type: "video",
        public_id: filename,
        format: "webm",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });

const resetRecordingState = async (room) => {
  room.activeRecording = {
    status: "idle",
    startedAt: null,
    startedBy: null,
    clientRecorderToken: null,
  };
  await room.save();
};

export async function POST(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await connectDB();
    const room = await PrayerRoom.findById(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const recordingToken = formData.get("recordingToken");
    const intent = formData.get("intent") || "upload";

    if (!recordingToken) {
      return NextResponse.json(
        { error: "Recording token missing" },
        { status: 400 }
      );
    }

    const activeToken = room?.activeRecording?.clientRecorderToken;
    if (!activeToken || activeToken !== recordingToken) {
      return NextResponse.json(
        { error: "Invalid or expired recording token" },
        { status: 403 }
      );
    }

    if (intent === "cancel") {
      await resetRecordingState(room);
      return NextResponse.json({ cancelled: true });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Audio file missing" },
        { status: 400 }
      );
    }

    if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const startedAt = formData.get("startedAt");
    const endedAt = formData.get("endedAt") || new Date().toISOString();
    const durationMs = Number(formData.get("durationMs"));

    const filename = `audio-${room.roomId}-${Date.now()}`;
    const uploadResult = await uploadBufferToCloudinary(buffer, filename);

    const computedDuration =
      Number.isFinite(durationMs) && durationMs > 0
        ? durationMs
        : typeof uploadResult.duration === "number"
        ? uploadResult.duration * 1000
        : null;

    const recordingEntry = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      startedAt: startedAt
        ? new Date(startedAt)
        : room.activeRecording?.startedAt
        ? new Date(room.activeRecording.startedAt)
        : null,
      endedAt: new Date(endedAt),
      durationMs: computedDuration,
      sizeBytes: uploadResult.bytes,
      startedBy: room.activeRecording?.startedBy,
      uploadedBy: userId,
      createdAt: new Date(),
    };

    room.recordings = room.recordings || [];
    room.recordings.unshift(recordingEntry);
    await resetRecordingState(room);

    return NextResponse.json({ recording: recordingEntry });
  } catch (error) {
    console.error("Audio upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload recording" },
      { status: 500 }
    );
  }
}
