import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/Event';

export async function GET(_, { params }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();
    const updated = await Event.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Event deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
