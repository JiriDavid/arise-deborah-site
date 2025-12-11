import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import PrayerRoom from "@/app/models/PrayerRoom";
import cloudinary from "@/app/lib/cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey =
  process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "arisedeborah";

const uploadBufferToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "prayer-room-archive",
        resource_type: "video",
        public_id: filename,
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
  console.log("[Upload Route] POST request received");
  try {
    const { userId } = await auth();
    console.log("[Upload Route] Auth userId:", userId);
    if (!userId) {
      console.warn("[Upload Route] No userId - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log("[Upload Route] Room ID:", id);
    await connectDB();
    const room = await PrayerRoom.findById(id);
    console.log("[Upload Route] Room found:", {
      roomId: room?._id,
      hasRecording: !!room?.activeRecording,
    });
    if (!room) {
      console.warn("[Upload Route] Room not found");
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const recordingToken = formData.get("recordingToken");
    const intent = formData.get("intent") || "upload";
    console.log("[Upload Route] FormData:", {
      intent,
      hasToken: !!recordingToken,
      tokenLength: recordingToken?.length,
    });

    if (!recordingToken) {
      console.warn("[Upload Route] No recording token");
      return NextResponse.json(
        { error: "Recording token missing" },
        { status: 400 }
      );
    }

    const activeToken = room?.activeRecording?.clientRecorderToken;
    const recordingStatus = room?.activeRecording?.status;
    console.log("[Upload Route] Token validation:", {
      activeToken: activeToken?.slice?.(0, 8),
      receivedToken: recordingToken?.slice?.(0, 8),
      match: activeToken === recordingToken,
      recordingStatus,
    });

    const tokenMatches = Boolean(activeToken && activeToken === recordingToken);

    if (intent === "cancel") {
      console.log(
        "[Upload Route] Cancel intent received; tokenMatches=",
        tokenMatches
      );
      if (!tokenMatches) {
        console.warn(
          "[Upload Route] Cancel called but token mismatch or idle; treating as already reset"
        );
      }
      await resetRecordingState(room);
      console.log("[Upload Route] Recording state reset for cancel");
      return NextResponse.json({
        cancelled: true,
        tokenMismatch: !tokenMatches,
      });
    }

    if (!tokenMatches) {
      // If the server state is already idle and the client still had chunks to upload,
      // accept the upload to avoid losing the recording, but flag it in logs.
      if (!activeToken && recordingStatus !== "recording") {
        console.warn(
          "[Upload Route] Token mismatch but server is idle — accepting upload to salvage recording"
        );
      } else {
        console.warn("[Upload Route] Token mismatch - rejecting upload");
        return NextResponse.json(
          { error: "Invalid or expired recording token" },
          { status: 403 }
        );
      }
    }
    console.log(
      "[Upload Route] Token validated or salvaged - proceeding with upload"
    );

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Audio file missing" },
        { status: 400 }
      );
    }

    if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      console.error("[Upload Route] Cloudinary env missing", {
        cloudName: !!cloudName,
        apiKey: !!cloudinaryApiKey,
        apiSecret: !!cloudinaryApiSecret,
      });
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

    const filename = `audio-${room.roomId || room._id}-${Date.now()}`;
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(buffer, filename);
    } catch (cloudErr) {
      console.error("[Upload Route] Cloudinary upload failed", {
        message: cloudErr?.message,
        http_code: cloudErr?.http_code,
        statusCode: cloudErr?.statusCode,
        name: cloudErr?.name,
        context: cloudErr?.context,
      });
      return NextResponse.json(
        {
          error: "Cloudinary upload failed",
          detail: cloudErr?.message,
          http_code: cloudErr?.http_code || cloudErr?.statusCode,
        },
        { status: 502 }
      );
    }

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
    console.error("[Upload Route] Caught error:", {
      message: error?.message,
      code: error?.code,
      http_code: error?.http_code,
    });
    return NextResponse.json(
      { error: error?.message || "Failed to upload recording" },
      { status: 500 }
    );
  }
}
