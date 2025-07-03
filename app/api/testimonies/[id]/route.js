import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Testimony from "@/app/models/Testimony";

// GET one sermon
export async function GET(_, { params }) {
  try {
    await connectDB();
    const testimony = await Testimony.findById(params.id);
    if (!sermon) {
      return NextResponse.json({ error: "Testimony not found" }, { status: 404 });
    }
    return NextResponse.json(testimony);
  } catch (error) {
    console.error("Error fetching sermon:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermon" },
      { status: 500 }
    );
  }
}

// UPDATE sermon
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const updates = await request.json();
    const updatedTestimony = await Testimony.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    if (!updatedTestimony) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json(updatedTestimony);
  } catch (error) {
    console.error("Error updating sermon:", error);
    return NextResponse.json(
      { error: "Failed to update sermon" },
      { status: 500 }
    );
  }
}

// DELETE sermon
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const result = await Testimony.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: "Testimony not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Testimony deleted successfully" });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    return NextResponse.json(
      { error: "Failed to delete testimony" },
      { status: 500 }
    );
  }
}
