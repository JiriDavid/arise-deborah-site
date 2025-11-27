import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import PrayerRoom from "@/app/models/PrayerRoom";
import { auth } from "@clerk/nextjs/server";

// GET specific prayer room
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const prayerRoom = await PrayerRoom.findById(id);
    if (!prayerRoom) {
      return NextResponse.json(
        { error: "Prayer room not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(prayerRoom);
  } catch (error) {
    console.error("Error fetching prayer room:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer room" },
      { status: 500 }
    );
  }
}

// PUT update prayer room (admin only)
export async function PUT(request, { params }) {
  try {
    const { userId, user } = await auth();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      user.publicMetadata?.role === "admin" ||
      user.publicMetadata?.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const updates = await request.json();
    const updatedRoom = await PrayerRoom.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Prayer room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating prayer room:", error);
    return NextResponse.json(
      { error: "Failed to update prayer room" },
      { status: 500 }
    );
  }
}

// DELETE prayer room (admin only)
export async function DELETE(request, { params }) {
  try {
    const { userId, user } = await auth();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      user.publicMetadata?.role === "admin" ||
      user.publicMetadata?.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const result = await PrayerRoom.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json(
        { error: "Prayer room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Prayer room deleted successfully" });
  } catch (error) {
    console.error("Error deleting prayer room:", error);
    return NextResponse.json(
      { error: "Failed to delete prayer room" },
      { status: 500 }
    );
  }
}
