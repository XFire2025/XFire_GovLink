// app/api/agent/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '../../../../lib/db';
import Appointment, { ServiceType, AppointmentStatus } from '../../../../lib/models/appointmentSchema';

type RecordUnknown = Record<string, unknown>;
const toIdString = (v: unknown): string | null => {
  if (v == null) return null;
  const obj = v as { _id?: unknown };
  const id = obj._id ?? v;
  if (typeof id === 'string') return id;
  if (id && typeof (id as { toString?: unknown }).toString === 'function') return String(id);
  return null;
};
const toDateString = (v: unknown): string | null => {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};
const toStringOrNull = (v: unknown): string | null => v == null ? null : String(v);

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
      type DateQuery = { $gte?: Date; $lte?: Date };
      const dateQuery: DateQuery = {};
      if (dateFrom) {
        dateQuery.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateQuery.$lte = new Date(dateTo);
      }
      filter.date = dateQuery;
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
        .lean<RecordUnknown[]>(),
      Appointment.countDocuments(filter)
    ]);

    // Transform data to match frontend interface
    const transformedAppointments = (appointments as RecordUnknown[]).map(appointment => ({
      id: toIdString(appointment._id) ?? toStringOrNull(appointment._id),
      citizenName: toStringOrNull(appointment.citizenName),
      citizenId: toStringOrNull(appointment.citizenNIC),
      serviceType: toStringOrNull(appointment.serviceType) as ServiceType | null,
      date: toDateString(appointment.date), // YYYY-MM-DD format
      time: toStringOrNull(appointment.time),
      status: toStringOrNull(appointment.status) as AppointmentStatus | null,
      priority: toStringOrNull(appointment.priority),
      notes: toStringOrNull(appointment.notes) ?? toStringOrNull(appointment.agentNotes),
      contactEmail: toStringOrNull(appointment.contactEmail),
      contactPhone: toStringOrNull(appointment.contactPhone),
      submittedDate: toDateString(appointment.submittedDate),
      bookingReference: toStringOrNull(appointment.bookingReference),
      assignedAgent: appointment.assignedAgent ? {
        id: toIdString((appointment.assignedAgent as RecordUnknown)._id) ?? toStringOrNull((appointment.assignedAgent as RecordUnknown)._id),
        name: toStringOrNull((appointment.assignedAgent as RecordUnknown)['fullName']),
        officerId: toStringOrNull((appointment.assignedAgent as RecordUnknown)['officerId'])
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
  // Narrow aggregation results to known shapes to avoid implicit any
  const serviceStatsTyped = serviceStats as Array<{ _id: string; count: number }>;
  const dailyStatsTyped = dailyStats as Array<{ _id: string; count: number }>;

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
          serviceBreakdown: (serviceStatsTyped).reduce((acc: Record<string, number>, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<ServiceType, number>),
          dailyStats: (dailyStatsTyped).map(item => ({
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