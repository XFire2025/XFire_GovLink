import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission, { SubmissionStatus } from '@/lib/models/submissionSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/submissions/[id] - Get specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      _id: params.id,
      departmentId: authResult.department!.departmentId
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission retrieved successfully',
      data: { submission }
    });

  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve submission' },
      { status: 500 }
    );
  }
}

// PUT /api/department/submissions/[id] - Update submission
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();

    // Find submission and verify it belongs to this department
    const submission = await Submission.findOne({
      _id: params.id,
      departmentId: authResult.department!.departmentId
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    const oldStatus = submission.status;
    const newStatus = body.status || oldStatus;

    // Add to history if status changed
    if (oldStatus !== newStatus) {
      submission.history.push({
        status: newStatus,
        comment: body.statusComment || 'Status updated by department',
        changedBy: authResult.department!.departmentId,
        changedByRole: 'department',
        timestamp: new Date()
      });

      // Calculate processing time if completed
      if (newStatus === SubmissionStatus.COMPLETED && !submission.actualCompletionDate) {
        submission.actualCompletionDate = new Date();
        const processingTime = submission.actualCompletionDate.getTime() - submission.submittedAt.getTime();
        submission.processingTimeHours = Math.round(processingTime / (1000 * 60 * 60));
      }
    }

    // Update allowed fields
    const updateFields = {
      status: newStatus,
      agentId: body.agentId,
      priority: body.priority,
      expectedCompletionDate: body.expectedCompletionDate,
      actualCompletionDate: body.actualCompletionDate,
      fees: body.fees,
      feesPaid: body.feesPaid,
      paymentReference: body.paymentReference,
      lastUpdatedAt: new Date()
    };

    // Remove undefined values
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    const updatedSubmission = await Submission.findByIdAndUpdate(
      params.id,
      {
        ...updateFields,
        history: submission.history
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: { submission: updatedSubmission }
    });

  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/department/submissions/[id] - Cancel submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      _id: params.id,
      departmentId: authResult.department!.departmentId
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation of pending or in-review submissions
    if (![SubmissionStatus.PENDING, SubmissionStatus.IN_REVIEW].includes(submission.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot cancel submission in current status',
          errors: ['Only pending or in-review submissions can be cancelled']
        },
        { status: 400 }
      );
    }

    // Update status to cancelled
    submission.status = SubmissionStatus.CANCELLED;
    submission.history.push({
      status: SubmissionStatus.CANCELLED,
      comment: 'Submission cancelled by department',
      changedBy: authResult.department!.departmentId,
      changedByRole: 'department',
      timestamp: new Date()
    });
    submission.lastUpdatedAt = new Date();

    await submission.save();

    return NextResponse.json({
      success: true,
      message: 'Submission cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel submission' },
      { status: 500 }
    );
  }
}