import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/lib/models/submissionSchema';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/dashboard - Get department dashboard data
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

    // Quick stats for today and this month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Total submissions count
    const totalSubmissions = await Submission.countDocuments({
      departmentId: departmentId
    });

    // Today's submissions
    const todaySubmissions = await Submission.countDocuments({
      departmentId: departmentId,
      submittedAt: { $gte: today }
    });

    // This month's submissions
    const monthSubmissions = await Submission.countDocuments({
      departmentId: departmentId,
      submittedAt: { $gte: thisMonth }
    });

    // Pending submissions
    const pendingSubmissions = await Submission.countDocuments({
      departmentId: departmentId,
      status: { $in: ['PENDING', 'IN_REVIEW'] }
    });

    // Recent submissions (last 10)
    const recentSubmissions = await Submission.find({
      departmentId: departmentId
    })
    .select('submissionId title applicantName status submittedAt priority')
    .sort({ submittedAt: -1 })
    .limit(10);

    // Status distribution
    const statusStats = await Submission.aggregate([
      {
        $match: { departmentId: departmentId }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Service uptime (active services percentage)
    const totalServices = department.services.length;
    const activeServices = department.services.filter((s: { isActive: boolean }) => s.isActive).length;
    const serviceUptime = totalServices > 0 ? (activeServices / totalServices) * 100 : 100;

    // Active agents today (simplified - just count active agents)
    const activeAgentsToday = department.activeAgents;

    // Quick metrics
    const dashboardStats = {
      totalSubmissions,
      todaySubmissions,
      monthSubmissions,
      pendingSubmissions,
      totalAgents: department.totalAgents,
      activeAgents: activeAgentsToday,
      serviceUptime: Math.round(serviceUptime * 10) / 10,
      totalServices,
      activeServices
    };

    // Calculate percentage changes (simplified)
    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const yesterdaySubmissions = await Submission.countDocuments({
      departmentId: departmentId,
      submittedAt: { 
        $gte: yesterdayStart,
        $lt: today
      }
    });

    const submissionChange = yesterdaySubmissions > 0 
      ? Math.round(((todaySubmissions - yesterdaySubmissions) / yesterdaySubmissions) * 100)
      : todaySubmissions > 0 ? 100 : 0;

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        stats: dashboardStats,
        changes: {
          submissionChange: submissionChange > 0 ? `+${submissionChange}%` : `${submissionChange}%`
        },
        statusDistribution: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentSubmissions
      }
    });

  } catch (error) {
    console.error('Get dashboard data error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve dashboard data' },
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