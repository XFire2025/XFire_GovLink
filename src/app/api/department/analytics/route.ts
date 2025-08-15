import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submissionSchema';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/analytics - Get department analytics
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
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const departmentId = authResult.department!.departmentId;

    // Get department info
    const department = await Department.findById(authResult.department!.id)
      .select('name totalAgents activeAgents services');

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Submission Analytics
    const submissionStats = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          avgProcessingTime: { $avg: '$processingTimeHours' },
          avgSatisfactionRating: { $avg: '$satisfactionRating' },
          totalFees: { $sum: '$fees' }
        }
      }
    ]);

    // Status Distribution
    const statusDistribution = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily Submissions (last 30 days)
    const dailySubmissions = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Service Performance
    const servicePerformance = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$serviceId',
          serviceName: { $first: '$serviceName' },
          totalSubmissions: { $sum: 1 },
          avgProcessingTime: { $avg: '$processingTimeHours' },
          avgSatisfactionRating: { $avg: '$satisfactionRating' },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedCount', '$totalSubmissions'] },
              100
            ]
          }
        }
      },
      {
        $sort: { totalSubmissions: -1 }
      }
    ]);

    // Agent Performance
    const agentPerformance = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          agentId: { $exists: true, $ne: null },
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$agentId',
          totalAssigned: { $sum: 1 },
          avgProcessingTime: { $avg: '$processingTimeHours' },
          avgSatisfactionRating: { $avg: '$satisfactionRating' },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'agents',
          localField: '_id',
          foreignField: '_id',
          as: 'agentInfo'
        }
      },
      {
        $addFields: {
          agentName: { $arrayElemAt: ['$agentInfo.fullName', 0] },
          completionRate: {
            $multiply: [
              { $divide: ['$completedCount', '$totalAssigned'] },
              100
            ]
          }
        }
      },
      {
        $project: {
          agentInfo: 0
        }
      },
      {
        $sort: { totalAssigned: -1 }
      }
    ]);

    // Peak Hours Analysis
    const peakHours = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$submittedAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Top Districts
    const topDistricts = await Submission.aggregate([
      {
        $match: {
          departmentId: departmentId,
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$applicantAddress.district',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Overall Stats
    const overallStats = {
      totalSubmissions: submissionStats[0]?.totalSubmissions || 0,
      avgProcessingTime: Math.round(submissionStats[0]?.avgProcessingTime || 0),
      avgSatisfactionRating: Math.round((submissionStats[0]?.avgSatisfactionRating || 0) * 10) / 10,
      totalFees: submissionStats[0]?.totalFees || 0,
      totalAgents: department.totalAgents,
      activeAgents: department.activeAgents,
      totalServices: department.services.length,
      activeServices: department.services.filter((s: { isActive: boolean }) => s.isActive).length
    };

    return NextResponse.json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        period: parseInt(period),
        overallStats,
        statusDistribution: statusDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        dailySubmissions,
        servicePerformance,
        agentPerformance,
        peakHours,
        topDistricts
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
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