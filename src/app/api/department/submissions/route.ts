import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/submissions - Get department's appointments (showing as submissions)
export async function GET(request: NextRequest) {
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      console.error('Department auth failed:', authResult.message);
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    console.log('Department authenticated:', authResult.department?.departmentId);

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

    // Build filter object - match appointments by department
    const filter: Record<string, unknown> = { department: authResult.department!.departmentId };
    
    console.log('Searching for appointments with department:', authResult.department!.departmentId);
    
    if (status) {
      // Map submission status to appointment status
      const appointmentStatus = status.toLowerCase();
      filter.status = appointmentStatus;
    }
    if (priority) filter.priority = priority.toLowerCase();
    if (agentId) filter.assignedAgent = agentId;
    
    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { citizenName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { citizenNIC: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) dateFilter.$lte = new Date(toDate);
      filter.date = dateFilter;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get appointments with pagination
    const appointments = await Appointment.find(filter)
      .sort({ submittedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedAgent', 'name email status')
      .populate('citizenId', 'fullName email')
      .select('-documents -agentNotes'); // Exclude large fields for list view

    console.log('Found appointments:', appointments.length);
    console.log('Filter used:', JSON.stringify(filter, null, 2));

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);
    
    console.log('Total appointments count:', total);

    // Get status counts for dashboard
    const statusCounts = await Appointment.aggregate([
      { $match: { department: authResult.department!.departmentId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Transform appointments to match submission interface
    const submissions = appointments.map(apt => ({
      id: apt._id.toString(),
      submissionId: apt.bookingReference,
      title: `${apt.serviceType.charAt(0).toUpperCase() + apt.serviceType.slice(1)} Appointment`,
      applicantName: apt.citizenName,
      applicantEmail: apt.contactEmail,
      status: apt.status.toUpperCase(),
      priority: apt.priority.toUpperCase(),
      serviceId: apt.serviceType,
      agentId: apt.assignedAgent?._id?.toString() || null,
      agentName: apt.assignedAgent?.name || null,
      agentEmail: apt.assignedAgent?.email || null,
      agentStatus: apt.assignedAgent?.status || null,
      submittedAt: apt.submittedDate.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
      // Additional appointment-specific fields
      appointmentDate: apt.date.toISOString(),
      appointmentTime: apt.time,
      bookingReference: apt.bookingReference,
      contactPhone: apt.contactPhone,
      citizenNIC: apt.citizenNIC
    }));

    return NextResponse.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statusCounts: statusCounts.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
          acc[item._id.toUpperCase()] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve appointments' },
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