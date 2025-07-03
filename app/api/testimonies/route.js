import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Testimony from "@/app/models/Testimony";

// GET all sermons
export async function GET() {
  try {
    await connectDB();
    const testimonies = await Testimony.find({}).sort({ date: -1 });
    return NextResponse.json(testimonies);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

// POST new testimony
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const testimony = await Testimony.create(data);
    return NextResponse.json(testimony, { status: 201 });
  } catch (error) {
    console.error("Error creating sermon:", error);
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}
