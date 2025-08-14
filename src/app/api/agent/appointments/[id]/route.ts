// app/api/agent/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import Appointment, { AppointmentStatus } from '@/lib/models/appointmentSchema';

// Define interfaces for better type safety
interface PopulatedCitizen {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  nicNumber?: string;
}

interface PopulatedAgent {
  _id: string;
  fullName: string;
  officerId: string;
  position: string;
}

interface AppointmentUpdateData {
  status?: AppointmentStatus;
  agentNotes?: string;
  assignedAgent?: string;
  priority?: 'normal' | 'urgent';
  cancellationReason?: string;
  requirements?: string[];
  confirmedDate?: Date;
  completedDate?: Date;
  cancelledDate?: Date;
  lastModifiedBy?: string;
}

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
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = params;

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
    const transformedAppointment = {
      id: appointment._id.toString(),
      citizenName: appointment.citizenName,
      citizenId: appointment.citizenNIC,
      serviceType: appointment.serviceType,
      date: appointment.date.toISOString().split('T')[0],
      time: appointment.time,
      status: appointment.status,
      priority: appointment.priority,
      notes: appointment.notes,
      agentNotes: appointment.agentNotes,
      contactEmail: appointment.contactEmail,
      contactPhone: appointment.contactPhone,
      submittedDate: appointment.submittedDate.toISOString().split('T')[0],
      bookingReference: appointment.bookingReference,
      confirmedDate: appointment.confirmedDate?.toISOString().split('T')[0],
      completedDate: appointment.completedDate?.toISOString().split('T')[0],
      cancelledDate: appointment.cancelledDate?.toISOString().split('T')[0],
      cancellationReason: appointment.cancellationReason,
      assignedAgent: appointment.assignedAgent ? {
        id: (appointment.assignedAgent as PopulatedAgent)._id,
        name: (appointment.assignedAgent as PopulatedAgent).fullName,
        officerId: (appointment.assignedAgent as PopulatedAgent).officerId,
        position: (appointment.assignedAgent as PopulatedAgent).position
      } : null,
      citizen: appointment.citizenId ? {
        id: (appointment.citizenId as PopulatedCitizen)._id,
        fullName: (appointment.citizenId as PopulatedCitizen).fullName,
        email: (appointment.citizenId as PopulatedCitizen).email,
        mobile: (appointment.citizenId as PopulatedCitizen).mobileNumber,
        nic: (appointment.citizenId as PopulatedCitizen).nicNumber
      } : null,
      requirements: appointment.requirements || [],
      notificationsSent: appointment.notificationsSent || { email: false, sms: false }
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
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = params;
    const body = await request.json();

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
    const updateData: AppointmentUpdateData = {};
    const allowedUpdates = [
      'status', 'agentNotes', 'assignedAgent', 'priority', 
      'cancellationReason', 'requirements'
    ];

    // Only update allowed fields
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updateData[field as keyof AppointmentUpdateData] = body[field];
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
     .populate('assignedAgent', 'fullName officerId');

    // Transform response
    const transformedAppointment = {
      id: updatedAppointment._id.toString(),
      citizenName: updatedAppointment.citizenName,
      citizenId: updatedAppointment.citizenNIC,
      serviceType: updatedAppointment.serviceType,
      date: updatedAppointment.date.toISOString().split('T')[0],
      time: updatedAppointment.time,
      status: updatedAppointment.status,
      priority: updatedAppointment.priority,
      notes: updatedAppointment.notes,
      agentNotes: updatedAppointment.agentNotes,
      contactEmail: updatedAppointment.contactEmail,
      contactPhone: updatedAppointment.contactPhone,
      submittedDate: updatedAppointment.submittedDate.toISOString().split('T')[0],
      bookingReference: updatedAppointment.bookingReference,
      confirmedDate: updatedAppointment.confirmedDate?.toISOString().split('T')[0],
      completedDate: updatedAppointment.completedDate?.toISOString().split('T')[0],
      cancelledDate: updatedAppointment.cancelledDate?.toISOString().split('T')[0],
      cancellationReason: updatedAppointment.cancellationReason
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
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = params;
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

    // Mock notification sending (in real implementation, integrate with SMS/Email service)
    const notificationData = {
      appointmentId: appointment._id,
      citizenName: appointment.citizenName,
      serviceType: appointment.serviceType,
      date: appointment.date.toISOString().split('T')[0],
      time: appointment.time,
      bookingReference: appointment.bookingReference,
      email: appointment.contactEmail,
      phone: appointment.contactPhone
    };

    // Simulate notification sending
    const notificationResult = {
      email: notificationType === 'email' || notificationType === 'both',
      sms: notificationType === 'sms' || notificationType === 'both',
      sentAt: new Date()
    };

    // Update notification status in appointment
    await Appointment.findByIdAndUpdate(id, {
      notificationsSent: {
        email: notificationResult.email,
        sms: notificationResult.sms,
        lastSentAt: notificationResult.sentAt
      }
    });

    console.log('Notification sent:', notificationData, notificationResult);

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notificationType,
        sentTo: {
          email: notificationResult.email ? appointment.contactEmail : null,
          phone: notificationResult.sms ? appointment.contactPhone : null
        },
        sentAt: notificationResult.sentAt
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