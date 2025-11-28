import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import PrayerRoom from "@/app/models/PrayerRoom";

const MINUTES_IN_DAY = 24 * 60;

const parseTimeToMinutes = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    return null;
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  if ([hours, minutes].some((value) => Number.isNaN(value))) {
    return null;
  }
  return hours * 60 + minutes;
};

const buildDateWithTime = (dateInput, timeString) => {
  if (!dateInput) return null;
  const baseDate = new Date(dateInput);
  if (Number.isNaN(baseDate.getTime())) return null;
  const [hours, minutes] = (timeString || "00:00").split(":").map(Number);
  if ([hours, minutes].some((value) => Number.isNaN(value))) {
    return null;
  }

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const isWithinDailyWindow = (room, referenceDate = new Date()) => {
  if (!room?.isRecurringDaily) {
    return false;
  }

  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
  const startMinutes = parseTimeToMinutes(room.scheduledStartTime);
  const endMinutes = parseTimeToMinutes(room.scheduledEndTime);

  if (startMinutes === null && endMinutes === null) {
    return true;
  }

  const start = startMinutes ?? 0;
  const end = endMinutes ?? MINUTES_IN_DAY - 1;

  if (start === end) {
    return true;
  }

  if (start < end) {
    return nowMinutes >= start && nowMinutes <= end;
  }

  return nowMinutes >= start || nowMinutes <= end;
};

const isWithinSingleSchedule = (room, referenceDate = new Date()) => {
  if (!room?.date) {
    return false;
  }

  const start = buildDateWithTime(room.date, room.scheduledStartTime);
  const end = buildDateWithTime(room.date, room.scheduledEndTime);

  if (!start || !end) {
    return false;
  }

  const adjustedEnd = new Date(end);
  if (adjustedEnd <= start) {
    adjustedEnd.setDate(adjustedEnd.getDate() + 1);
  }

  return referenceDate >= start && referenceDate <= adjustedEnd;
};

// Test LiveKit credentials
const testToken = async () => {
  try {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: "test-user",
      name: "Test User",
    });
    at.addGrant({
      roomJoin: true,
      room: "test-room",
      canPublish: true,
      canSubscribe: true,
    });
    const token = await at.toJwt();
    console.log(
      "LiveKit credentials test - token:",
      token ? "generated" : "undefined"
    );
    console.log("LiveKit credentials test - token type:", typeof token);
    return token && typeof token === "string" && token.length > 0;
  } catch (error) {
    console.error("LiveKit credentials test failed:", error);
    return false;
  }
};

// You'll need to add these to your .env file
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

console.log("Checking env:", {
  apiKey: process.env.LIVEKIT_API_KEY?.length,
  secret: process.env.LIVEKIT_API_SECRET?.length,
  server: process.env.NEXT_PUBLIC_LIVEKIT_URL,
});

export async function POST(request, { params }) {
  console.log("Join API called with params:", params);
  try {
    const { userId } = await auth();
    console.log("Auth result - userId:", userId);
    if (!userId) {
      console.log("No userId - returning unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await request.json();

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
      console.error("Missing LiveKit configuration:", {
        hasKey: !!LIVEKIT_API_KEY,
        hasSecret: !!LIVEKIT_API_SECRET,
        hasUrl: !!LIVEKIT_URL,
        url: LIVEKIT_URL,
      });
      return NextResponse.json(
        { error: "LiveKit not configured" },
        { status: 500 }
      );
    }

    // Test LiveKit credentials
    console.log("Testing LiveKit credentials...");
    if (!(await testToken())) {
      console.log("LiveKit credentials test failed");
      return NextResponse.json(
        { error: "Invalid LiveKit credentials" },
        { status: 500 }
      );
    }
    console.log("LiveKit credentials test passed");

    // Fetch the room to get the correct roomId
    await connectDB();
    const room = await PrayerRoom.findById(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if room is active or within its scheduled window
    const now = new Date();
    const withinDailyWindow = isWithinDailyWindow(room, now);
    const withinSingleWindow = isWithinSingleSchedule(room, now);
    const isRoomActive = Boolean(
      room.isActive || withinDailyWindow || withinSingleWindow
    );

    if (!isRoomActive) {
      return NextResponse.json(
        { error: "Room is not currently active for this time window" },
        { status: 403 }
      );
    }

    console.log("Joining room:", room.roomId, "for user:", userId);

    // Create LiveKit access token using the roomId field
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: userId,
      name: name || "Anonymous",
    });

    at.addGrant({
      roomJoin: true,
      room: room.roomId, // Use the roomId field, not the MongoDB _id
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    console.log(
      "Generated token for room:",
      room.roomId,
      "token:",
      token ? "generated" : "undefined",
      "token type:",
      typeof token
    );

    if (!token || typeof token !== "string" || token.length === 0) {
      console.error("Failed to generate valid token");
      return NextResponse.json(
        { error: "Failed to generate access token" },
        { status: 500 }
      );
    }

    // Validate token by checking if it can be decoded
    try {
      const decoded = await at.toJwt();
      console.log("Token validation successful");
    } catch (tokenError) {
      console.error("Token generation failed:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate valid token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token,
      url: LIVEKIT_URL,
      roomId: room.roomId,
    });
  } catch (error) {
    console.error("Error in join API:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
