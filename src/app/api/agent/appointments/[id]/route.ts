// app/api/agent/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import Appointment, { AppointmentStatus, IAppointmentDocument } from '@/lib/models/appointmentSchema';
import { getPresignedUrlForR2 } from '@/lib/r2';
import { govLinkEmailTemplates, sendEmail } from '@/lib/services/govlinkEmailService';
import ScheduledEmail from '@/lib/models/scheduledEmail';

// Define interfaces for better type safety
// Helper narrowers to avoid `any` usage in multiple handlers
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

// REMOVED: This type is no longer needed with the correct function signature.
// type RouteContext = { params: { id: string } } | unknown;

const toArray = (v: unknown): unknown[] => Array.isArray(v) ? v : [];
const toNotifications = (v: unknown): { email: boolean; sms: boolean } => {
  const obj = (v as RecordUnknown | null) ?? null;
  return {
    email: !!(obj && typeof obj['email'] === 'boolean' ? obj['email'] : false),
    sms: !!(obj && typeof obj['sms'] === 'boolean' ? obj['sms'] : false)
  };
};

interface ValidationError {
  message: string;
  path?: string;
  value?: unknown;
}

interface MongooseValidationError extends Error {
  errors: Record<string, ValidationError>;
}

// Helper function to validate status transitions
function isValidStatusTransition(currentStatus: AppointmentStatus, newStatus: AppointmentStatus): boolean {
  const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['completed', 'cancelled'],
    'cancelled': [], // Cannot change from cancelled
    'completed': [] // Cannot change from completed
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

// Helper function to validate appointment status
function isValidAppointmentStatus(status: string): status is AppointmentStatus {
  const validStatuses: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
  return validStatuses.includes(status as AppointmentStatus);
}

// Get single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid appointment ID',
        errors: ['Invalid appointment ID format']
      }, { status: 400 });
    }

    // Find appointment
    const appointment = await Appointment.findById(id)
      .populate('citizenId', 'fullName email mobileNumber nicNumber')
      .populate('assignedAgent', 'fullName officerId position')
      .lean();

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found',
        errors: ['Appointment does not exist']
      }, { status: 404 });
    }

    // Transform data to match frontend interface
    const appt = appointment as unknown as Record<string, unknown>;

    // NEW LOGIC BLOCK: Generate presigned URLs for all documents
    const documentsWithPresignedUrls = await Promise.all(
      (toArray(appt.documents) as IAppointmentDocument[]).map(async (doc) => {
        // 'doc.url' currently holds the R2 object key
        const presignedUrlResult = await getPresignedUrlForR2(doc.url); 
        // Fixed: Use proper type assertion instead of any
        const docWithId = doc as IAppointmentDocument & { _id?: unknown };
        return {
          id: toIdString(docWithId._id),
          name: toStringOrNull(doc.name),
          label: toStringOrNull(doc.label),
          url: presignedUrlResult.success ? presignedUrlResult.url : null, // Use the new temporary URL
          fileName: toStringOrNull(doc.fileName),
          fileType: toStringOrNull(doc.fileType),
          fileSize: typeof doc.fileSize === 'number' ? doc.fileSize : 0,
          uploadedAt: toDateString(doc.uploadedAt)
        };
      })
    );

    const transformedAppointment = {
      id: toIdString(appt._id) ?? toStringOrNull(appt._id),
      citizenName: toStringOrNull(appt.citizenName),
      citizenId: toStringOrNull(appt.citizenNIC),
      serviceType: toStringOrNull(appt.serviceType),
      date: toDateString(appt.date),
      time: toStringOrNull(appt.time),
      status: toStringOrNull(appt.status),
      priority: toStringOrNull(appt.priority) as string | null,
      notes: toStringOrNull(appt.notes),
      agentNotes: toStringOrNull(appt.agentNotes),
      contactEmail: toStringOrNull(appt.contactEmail),
      contactPhone: toStringOrNull(appt.contactPhone),
      submittedDate: toDateString(appt.submittedDate),
      bookingReference: toStringOrNull(appt.bookingReference),
      confirmedDate: toDateString(appt.confirmedDate),
      completedDate: toDateString(appt.completedDate),
      cancelledDate: toDateString(appt.cancelledDate),
      cancellationReason: toStringOrNull(appt.cancellationReason),
      assignedAgent: appt.assignedAgent ? {
        id: toIdString(appt.assignedAgent),
        name: toStringOrNull((appt.assignedAgent as Record<string, unknown>)['fullName']),
        officerId: toStringOrNull((appt.assignedAgent as Record<string, unknown>)['officerId']),
        position: toStringOrNull((appt.assignedAgent as Record<string, unknown>)['position'])
      } : null,
      citizen: appt.citizenId ? {
        id: toIdString(appt.citizenId),
        fullName: toStringOrNull((appt.citizenId as Record<string, unknown>)['fullName']),
        email: toStringOrNull((appt.citizenId as Record<string, unknown>)['email']),
        mobile: toStringOrNull((appt.citizenId as Record<string, unknown>)['mobileNumber']),
        nic: toStringOrNull((appt.citizenId as Record<string, unknown>)['nicNumber'])
      } : null,
      requirements: toArray(appt.requirements),
      notificationsSent: toNotifications(appt.notificationsSent),
      documents: documentsWithPresignedUrls // UPDATED: Use the array with secure, temporary URLs
    };

    return NextResponse.json({
      success: true,
      message: 'Appointment retrieved successfully',
      data: transformedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Get appointment API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve appointment',
      errors: ['Internal server error']
    }, { status: 500 });
  }
}

// Update appointment (status, notes, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;
    const body = await request.json();
    const bodyObj = body as RecordUnknown;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid appointment ID',
        errors: ['Invalid appointment ID format']
      }, { status: 400 });
    }

    // Find existing appointment
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found',
        errors: ['Appointment does not exist']
      }, { status: 404 });
    }

    // Validate status if provided
    if (body.status && !isValidAppointmentStatus(body.status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status',
        errors: ['Status must be one of: pending, confirmed, cancelled, completed']
      }, { status: 400 });
    }

    // Prepare update object
    const updateData: Record<string, unknown> = {};
    const allowedUpdates = [
      'status', 'agentNotes', 'assignedAgent', 'priority',
      'cancellationReason', 'requirements'
    ] as const;

    // Only update allowed fields
    for (const field of allowedUpdates) {
      const key = field as string;
      if (bodyObj[key] !== undefined) {
        updateData[key] = bodyObj[key] as unknown;
      }
    }

    // Handle status-specific updates
    if (body.status && body.status !== existingAppointment.status) {
      updateData.status = body.status as AppointmentStatus;
      
      switch (body.status as AppointmentStatus) {
        case 'confirmed':
          updateData.confirmedDate = new Date();
          break;
        case 'completed':
          updateData.completedDate = new Date();
          break;
        case 'cancelled':
          updateData.cancelledDate = new Date();
          if (body.cancellationReason) {
            updateData.cancellationReason = body.cancellationReason;
          }
          break;
      }
    }

    // Add audit information
    updateData.lastModifiedBy = body.agentId || 'system';

    // Validate status transition
    if (body.status && body.status !== existingAppointment.status) {
      const currentStatus = existingAppointment.status as AppointmentStatus;
      const newStatus = body.status as AppointmentStatus;
      
      if (!isValidStatusTransition(currentStatus, newStatus)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid status transition',
          errors: [`Cannot change status from ${currentStatus} to ${newStatus}`]
        }, { status: 400 });
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('citizenId', 'fullName email mobileNumber')
     .populate('assignedAgent', 'fullName officerId') as RecordUnknown | null;

    if (!updatedAppointment) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found after update',
        errors: ['Appointment does not exist']
      }, { status: 404 });
    }

    // Transform response
    const up = updatedAppointment as RecordUnknown;
    const transformedAppointment = {
      id: toIdString(up._id) ?? toStringOrNull(up._id),
      citizenName: toStringOrNull(up.citizenName),
      citizenId: toStringOrNull(up.citizenNIC),
      serviceType: toStringOrNull(up.serviceType),
      date: toDateString(up.date),
      time: toStringOrNull(up.time),
      status: toStringOrNull(up.status),
      priority: toStringOrNull(up.priority) as string | null,
      notes: toStringOrNull(up.notes),
      agentNotes: toStringOrNull(up.agentNotes),
      contactEmail: toStringOrNull(up.contactEmail),
      contactPhone: toStringOrNull(up.contactPhone),
      submittedDate: toDateString(up.submittedDate),
      bookingReference: toStringOrNull(up.bookingReference),
      confirmedDate: toDateString(up.confirmedDate),
      completedDate: toDateString(up.completedDate),
      cancelledDate: toDateString(up.cancelledDate),
      cancellationReason: toStringOrNull(up.cancellationReason)
    };

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      data: transformedAppointment
    }, { status: 200 });

  } catch (error) {
    console.error('Update appointment API error:', error);
    
    // Handle validation errors with proper typing
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as MongooseValidationError;
      const errors = Object.values(validationError.errors).map((err: ValidationError) => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update appointment',
      errors: ['Internal server error']
    }, { status: 500 });
  }
}

// Send notification for appointment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;
    const body = await request.json();
    const { action, notificationType = 'both' } = body;

    if (action !== 'sendNotification') {
      return NextResponse.json({
        success: false,
        message: 'Invalid action',
        errors: ['Only sendNotification action is supported']
      }, { status: 400 });
    }

    // Validate notification type
    if (!['email', 'sms', 'both'].includes(notificationType)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid notification type',
        errors: ['Notification type must be email, sms, or both']
      }, { status: 400 });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid appointment ID',
        errors: ['Invalid appointment ID format']
      }, { status: 400 });
    }

    // Find appointment
    const appointment = await Appointment.findById(id)
      .populate('citizenId', 'fullName email mobileNumber preferredLanguage');

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found',
        errors: ['Appointment does not exist']
      }, { status: 404 });
    }

    const shouldSendEmail = notificationType === 'email' || notificationType === 'both';

  const citizenObj = appointment.citizenId && typeof appointment.citizenId === 'object' ? appointment.citizenId as Record<string, unknown> : null;
  const citizenName = citizenObj && typeof citizenObj['fullName'] === 'string' ? citizenObj['fullName'] as string : appointment.citizenName;

  const agentObj = appointment.assignedAgent && typeof appointment.assignedAgent === 'object' ? appointment.assignedAgent as Record<string, unknown> : null;
  const agentName = agentObj && typeof agentObj['fullName'] === 'string' ? agentObj['fullName'] as string : 'Agent';

    let emailResult: { success: boolean; message: string; messageId?: string; error?: string } | null = null;
    // If email is requested, send immediate reminder email
    if (shouldSendEmail && appointment.contactEmail) {
      try {
        const template = govLinkEmailTemplates.appointmentReminder(
          citizenName,
          {
            service: appointment.serviceType,
            date: appointment.date.toISOString().split('T')[0],
            time: appointment.time,
            agent: agentName,
            location: typeof (appointment as Record<string, unknown>)['location'] === 'string' ? (appointment as Record<string, unknown>)['location'] as string : undefined
          }
        );

        emailResult = await sendEmail({
          to: appointment.contactEmail,
          subject: template.subject,
          html: template.html
        });
      } catch (err) {
        console.error('Failed to send immediate reminder email:', err);
        emailResult = { success: false, message: 'Failed to send email', error: String(err) };
      }
    }

    // Create scheduled email for 24 hours before appointment
    try {
      const apptDate = appointment.date instanceof Date ? appointment.date : new Date(String(appointment.date));
      const scheduledAt = new Date(apptDate.getTime() - 24 * 60 * 60 * 1000);

      const reminderTemplate = govLinkEmailTemplates.appointmentReminder(
        citizenName,
        {
          service: appointment.serviceType,
          date: apptDate.toISOString().split('T')[0],
          time: appointment.time,
          agent: agentName,
          location: typeof (appointment as Record<string, unknown>)['location'] === 'string' ? (appointment as Record<string, unknown>)['location'] as string : undefined
        }
      );

      // Avoid duplicate scheduled reminders for the same appointment and scheduledAt
      const existing = await ScheduledEmail.findOne({
        appointmentId: appointment._id,
        // match scheduledAt within a 60 second window to account for timezone/precision
        scheduledAt: { $gte: new Date(scheduledAt.getTime() - 60000), $lte: new Date(scheduledAt.getTime() + 60000) }
      });

      if (!existing) {
        const scheduled = new ScheduledEmail({
          appointmentId: appointment._id,
          to: appointment.contactEmail || (citizenObj && typeof citizenObj['email'] === 'string' ? citizenObj['email'] as string : ''),
          subject: reminderTemplate.subject,
          html: reminderTemplate.html,
          scheduledAt,
          sent: false
        });

        await scheduled.save();
      } else {
        // already scheduled; skip creating duplicate
        console.log('Scheduled reminder already exists for appointment', appointment._id.toString());
      }
    } catch (err) {
      console.error('Failed to create scheduled reminder:', err);
      // don't fail the whole request for scheduled creation errors; log and continue
    }

    // Update notification status in appointment
    await Appointment.findByIdAndUpdate(id, {
      notificationsSent: {
        email: shouldSendEmail,
        sms: notificationType === 'sms' || notificationType === 'both',
        lastSentAt: shouldSendEmail ? new Date() : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Notification processed',
      data: {
        notificationType,
        sentTo: {
          email: shouldSendEmail ? appointment.contactEmail : null,
          phone: notificationType === 'sms' || notificationType === 'both' ? appointment.contactPhone : null
        },
        emailResult
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Send notification API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send notification',
      errors: ['Internal server error']
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}