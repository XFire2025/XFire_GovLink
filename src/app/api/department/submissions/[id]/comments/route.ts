import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submissionSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/submissions/[id]/comments - Get submission comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    const submission = await Submission.findOne({
      _id: id,
      departmentId: authResult.department!.departmentId
    }).select('comments');

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Sort comments by timestamp (newest first)
    const comments = submission.comments.sort((a: { timestamp: Date }, b: { timestamp: Date }) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: { comments }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve comments' },
      { status: 500 }
    );
  }
}

// POST /api/department/submissions/[id]/comments - Add comment to submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    const { message, isInternal = false } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Comment message is required',
          errors: ['Message cannot be empty']
        },
        { status: 400 }
      );
    }

    const submission = await Submission.findOne({
      _id: id,
      departmentId: authResult.department!.departmentId
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Create new comment
    const newComment = {
      id: `CMT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: message.trim(),
      author: authResult.department!.departmentId,
      authorRole: 'department' as const,
      timestamp: new Date(),
      isInternal: Boolean(isInternal)
    };

    // Add comment to submission
    submission.comments.push(newComment);
    submission.lastUpdatedAt = new Date();

    await submission.save();

    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    }, { status: 201 });

  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add comment' },
      { status: 500 }
    );
  }
}