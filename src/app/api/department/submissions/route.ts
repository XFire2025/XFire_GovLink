import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submissionSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/submissions - Get department's submissions
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const agentId = searchParams.get('agentId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    // Build filter object
    const filter: Record<string, unknown> = { departmentId: authResult.department!.departmentId };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (agentId) filter.agentId = agentId;
    
    if (search) {
      filter.$or = [
        { submissionId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { applicantName: { $regex: search, $options: 'i' } },
        { applicantEmail: { $regex: search, $options: 'i' } },
        { applicantNIC: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) dateFilter.$lte = new Date(toDate);
      filter.submittedAt = dateFilter;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get submissions with pagination
    const submissions = await Submission.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-formData -documents'); // Exclude large fields for list view

    // Get total count for pagination
    const total = await Submission.countDocuments(filter);

    // Get status counts for dashboard
    const statusCounts = await Submission.aggregate([
      { $match: { departmentId: authResult.department!.departmentId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Submissions retrieved successfully',
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve submissions' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Submissions are created by users.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}