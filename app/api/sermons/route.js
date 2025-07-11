import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Sermon from '@/app/models/Sermon';

// GET all sermons
export async function GET() {
  try {
    await connectDB();
    const sermons = await Sermon.find({}).sort({ date: -1 });
    return NextResponse.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermons' },
      { status: 500 }
    );
  }
}

// POST new sermon
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const sermon = await Sermon.create(data);
    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error('Error creating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to create sermon' },
      { status: 500 }
    );
  }
}
