import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Sermon from '@/app/models/Sermon';

// GET one sermon
export async function GET(_, { params }) {
  try {
    await connectDB();
    const sermon = await Sermon.findById(params.id);
    if (!sermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
    }
    return NextResponse.json(sermon);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    return NextResponse.json({ error: 'Failed to fetch sermon' }, { status: 500 });
  }
}

// UPDATE sermon
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const updates = await request.json();
    const updatedSermon = await Sermon.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    if (!updatedSermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
    }
    return NextResponse.json(updatedSermon);
  } catch (error) {
    console.error('Error updating sermon:', error);
    return NextResponse.json({ error: 'Failed to update sermon' }, { status: 500 });
  }
}

// DELETE sermon
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const result = await Sermon.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    return NextResponse.json({ error: 'Failed to delete sermon' }, { status: 500 });
  }
}
