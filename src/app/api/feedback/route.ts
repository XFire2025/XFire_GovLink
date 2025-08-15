import { NextRequest, NextResponse } from 'next/server';
import mongoose, { FilterQuery } from 'mongoose';
import Feedback, { IFeedback, FeedbackType } from '@/lib/models/feedbackSchema';

// Database connection function
async function connectToMongoDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Custom Error type for MongoDB errors
interface MongoError extends Error {
    code?: number;
}

// Types
interface FeedbackRequestBody {
  name: string;
  email: string;
  feedbackType: FeedbackType;
  rating?: number | null;
  subject: string;
  message: string;
  language?: string;
  timestamp?: string;
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}

// POST - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToMongoDB();

    // Parse request body
    const body: FeedbackRequestBody = await request.json();
    
    // Log the received data for debugging
    console.log('Received feedback data:', {
      name: body.name,
      email: body.email,
      feedbackType: body.feedbackType,
      subject: body.subject,
      message: body.message?.substring(0, 50) + '...',
      rating: body.rating,
      language: body.language
    });

    // Validate required fields
    if (!body.name || !body.email || !body.feedbackType || !body.subject || !body.message) {
      console.log('Missing fields validation failed:', {
        hasName: !!body.name,
        hasEmail: !!body.email,
        hasFeedbackType: !!body.feedbackType,
        hasSubject: !!body.subject,
        hasMessage: !!body.message
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields. Please provide name, email, feedback type, subject, and message.' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide a valid email address.' 
        },
        { status: 400 }
      );
    }

    // Validate feedback type
    const validTypes: FeedbackType[] = ['general', 'bug', 'feature', 'service'];
    if (!validTypes.includes(body.feedbackType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid feedback type. Must be one of: general, bug, feature, service' 
        },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (body.rating !== null && body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      console.log('Rating validation failed:', body.rating);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rating must be between 1 and 5.' 
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.length > 5000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message is too long. Maximum 5000 characters allowed.' 
        },
        { status: 400 }
      );
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = getClientIP(request);

    // Generate reference ID
    const referenceId = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Sanitize inputs
    const sanitizedData = {
      referenceId,
      name: sanitizeInput(body.name),
      email: body.email.toLowerCase().trim(),
      feedbackType: body.feedbackType,
      rating: body.rating,
      subject: sanitizeInput(body.subject),
      message: sanitizeInput(body.message),
      language: body.language || 'en',
      userAgent,
      ipAddress,
      submittedAt: new Date()
    };

    console.log('Saving feedback with data:', {
      ...sanitizedData,
      message: sanitizedData.message.substring(0, 50) + '...'
    });

    // Create new feedback
    const feedback = new Feedback(sanitizedData);
    await feedback.save();

    // Return success response with reference ID
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: {
        referenceId: feedback.referenceId,
        submittedAt: feedback.submittedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Feedback submission error:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && 'code' in error && (error as MongoError).code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Duplicate submission detected. Please try again.' 
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data provided. Please check your inputs and try again.' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve feedback (for admin use)
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') as FeedbackType | null;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Build query
    const query: FilterQuery<IFeedback> = {};
    if (type) query.feedbackType = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get feedback with pagination
    const feedback = await Feedback.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-userAgent -ipAddress');

    // Get total count for pagination
    const total = await Feedback.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Feedback retrieval error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve feedback.' 
      },
      { status: 500 }
    );
  }
}