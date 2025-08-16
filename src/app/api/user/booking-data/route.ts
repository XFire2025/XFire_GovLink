// src/app/api/user/booking-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

interface BookingData {
  userId: string;
  sessionId: string;
  step: string;
  department?: string;
  departmentName?: string;
  service?: string;
  serviceName?: string;
  agent?: string;
  agentName?: string;
  date?: string;
  time?: string;
  notes?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, unique: true },
  step: { type: String, required: true },
  department: String,
  departmentName: String,
  service: String,
  serviceName: String,
  agent: String,
  agentName: String,
  date: String,
  time: String,
  notes: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'booking_data'
});

// TTL index - automatically delete documents after 24 hours
BookingDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const BookingDataModel = mongoose.models.BookingData || mongoose.model<BookingData>('BookingData', BookingDataSchema);

// GET - Retrieve booking data by session ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const bookingData = await BookingDataModel.findOne({
      sessionId,
      userId
    }).lean();

    if (!bookingData) {
      return NextResponse.json(
        { success: false, message: 'Booking data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookingData
    });

  } catch (error) {
    console.error('Error retrieving booking data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve booking data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Save or update booking data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      sessionId, 
      step, 
      department, 
      departmentName, 
      service, 
      serviceName, 
      agent, 
      agentName, 
      date, 
      time, 
      notes, 
      completed = false 
    } = body;

    if (!userId || !sessionId || !step) {
      return NextResponse.json(
        { success: false, message: 'User ID, Session ID, and step are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const bookingData = await BookingDataModel.findOneAndUpdate(
      { sessionId, userId },
      {
        $set: {
          step,
          department,
          departmentName,
          service,
          serviceName,
          agent,
          agentName,
          date,
          time,
          notes,
          completed,
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Booking data saved successfully',
      data: bookingData
    });

  } catch (error) {
    console.error('Error saving booking data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save booking data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear booking data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await BookingDataModel.deleteOne({
      sessionId,
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking data cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing booking data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to clear booking data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
