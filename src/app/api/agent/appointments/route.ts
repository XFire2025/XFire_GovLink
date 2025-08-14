// app/api/agent/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Appointment, { ServiceType, AppointmentStatus } from '@/lib/models/appointmentSchema';

// Helper function to validate service type
function isValidServiceType(value: string): value is ServiceType {
  const validTypes: ServiceType[] = ['passport', 'license', 'certificate', 'registration', 'visa'];
  return validTypes.includes(value as ServiceType);
}

// Helper function to validate appointment status
function isValidAppointmentStatus(value: string): value is AppointmentStatus {
  const validStatuses: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
  return validStatuses.includes(value as AppointmentStatus);
}

export async function GET(request: NextRequest) {
  try {
    await connect();

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const serviceType = searchParams.get('serviceType') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build filter object
    const filter: Record<string, unknown> = {};

    // Search filter (name, NIC, or email)
    if (search) {
      filter.$or = [
        { citizenName: { $regex: search, $options: 'i' } },
        { citizenNIC: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter with validation
    if (status !== 'all') {
      if (isValidAppointmentStatus(status)) {
        filter.status = status;
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid status parameter',
          errors: ['Status must be one of: pending, confirmed, cancelled, completed']
        }, { status: 400 });
      }
    }

    // Service type filter with validation
    if (serviceType !== 'all') {
      if (isValidServiceType(serviceType)) {
        filter.serviceType = serviceType;
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid serviceType parameter',
          errors: ['Service type must be one of: passport, license, certificate, registration, visa']
        }, { status: 400 });
      }
    }

    // Priority filter
    if (priority !== 'all') {
      if (priority === 'normal' || priority === 'urgent') {
        filter.priority = priority;
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid priority parameter',
          errors: ['Priority must be either normal or urgent']
        }, { status: 400 });
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date.$lte = new Date(dateTo);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter)
        .populate('citizenId', 'fullName email mobileNumber')
        .populate('assignedAgent', 'fullName officerId')
        .sort({ submittedDate: -1, date: 1, time: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter)
    ]);

    // Transform data to match frontend interface
    const transformedAppointments = appointments.map(appointment => ({
      id: appointment._id.toString(),
      citizenName: appointment.citizenName,
      citizenId: appointment.citizenNIC,
      serviceType: appointment.serviceType as ServiceType,
      date: appointment.date.toISOString().split('T')[0], // YYYY-MM-DD format
      time: appointment.time,
      status: appointment.status as AppointmentStatus,
      priority: appointment.priority,
      notes: appointment.notes || appointment.agentNotes,
      contactEmail: appointment.contactEmail,
      contactPhone: appointment.contactPhone,
      submittedDate: appointment.submittedDate.toISOString().split('T')[0],
      bookingReference: appointment.bookingReference,
      assignedAgent: appointment.assignedAgent ? {
        id: appointment.assignedAgent._id,
        name: appointment.assignedAgent.fullName,
        officerId: appointment.assignedAgent.officerId
      } : null
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: {
        appointments: transformedAppointments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasMore
        },
        filters: {
          search,
          status,
          serviceType,
          priority,
          dateFrom,
          dateTo
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get appointments API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve appointments',
      errors: ['Internal server error']
    }, { status: 500 });
  }
}

// Get appointment statistics
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { action } = body;

    if (action === 'getStats') {
      // Get appointment statistics using proper type assertions
      const [
        totalCount,
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        todayCount,
        urgentCount
      ] = await Promise.all([
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: 'pending' as AppointmentStatus }),
        Appointment.countDocuments({ status: 'confirmed' as AppointmentStatus }),
        Appointment.countDocuments({ status: 'completed' as AppointmentStatus }),
        Appointment.countDocuments({ status: 'cancelled' as AppointmentStatus }),
        Appointment.countDocuments({
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }),
        Appointment.countDocuments({ priority: 'urgent' })
      ]);

      // Get service type breakdown
      const serviceStats = await Appointment.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get daily appointment counts for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const dailyStats = await Appointment.aggregate([
        {
          $match: {
            date: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$date'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return NextResponse.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          overview: {
            total: totalCount,
            pending: pendingCount,
            confirmed: confirmedCount,
            completed: completedCount,
            cancelled: cancelledCount,
            today: todayCount,
            urgent: urgentCount
          },
          serviceBreakdown: serviceStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<ServiceType, number>),
          dailyStats: dailyStats.map(item => ({
            date: item._id,
            count: item.count
          }))
        }
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action',
      errors: ['Unknown action requested']
    }, { status: 400 });

  } catch (error) {
    console.error('Appointment stats API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve statistics',
      errors: ['Internal server error']
    }, { status: 500 });
  }
}

// Handle unsupported methods
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