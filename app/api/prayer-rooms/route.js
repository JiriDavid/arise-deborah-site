import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import PrayerRoom from "@/app/models/PrayerRoom";
import { getAdminUser } from "@/app/lib/adminAuth";

// GET all prayer rooms
export async function GET() {
  try {
    await connectDB();
    const prayerRooms = await PrayerRoom.find({})
      .sort({ date: 1, scheduledStartTime: 1 })
      .populate("createdBy", "name");
    return NextResponse.json(prayerRooms);
  } catch (error) {
    console.error("Error fetching prayer rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer rooms" },
      { status: 500 }
    );
  }
}

// POST create new prayer room (admin only)
export async function POST(request) {
  try {
    const { user, isAdmin } = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Generate unique room ID
    const roomId = `prayer-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const prayerRoom = await PrayerRoom.create({
      ...data,
      roomId,
      createdBy: user.id,
    });

    return NextResponse.json(prayerRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating prayer room:", error);
    return NextResponse.json(
      { error: "Failed to create prayer room" },
      { status: 500 }
    );
  }
}
