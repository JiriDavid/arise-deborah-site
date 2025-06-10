import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/Event';

// GET all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST a new event
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const event = await Event.create(data);
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
