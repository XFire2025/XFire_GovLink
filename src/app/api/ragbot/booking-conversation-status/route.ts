// src/app/api/ragbot/booking-conversation-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Use the same schema as the booking conversation
const BookingConversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, default: null },
  currentStep: { type: String, default: 'start' },
  collectedData: {
    department: { type: String, default: '' },
    service: { type: String, default: '' },
    agentType: { type: String, default: '' },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    additionalNotes: { type: String, default: '' }
  },
  conversationHistory: [{ 
    message: String, 
    response: String, 
    timestamp: { type: Date, default: Date.now } 
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add TTL index to auto-delete after 24 hours
BookingConversationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const BookingConversation = mongoose.models.BookingConversation || 
  mongoose.model('BookingConversation', BookingConversationSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the booking conversation for this session
    const conversation = await BookingConversation.findOne({ sessionId });

    if (!conversation) {
      return NextResponse.json({
        isComplete: false,
        collectedData: null
      });
    }

    // Check if the conversation is complete
    const isComplete = conversation.currentStep === 'complete';

    return NextResponse.json({
      isComplete,
      collectedData: isComplete ? conversation.collectedData : null,
      currentStep: conversation.currentStep
    });

  } catch (error) {
    console.error('Error checking booking conversation status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
