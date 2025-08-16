// app/api/public/verify-appointment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import { parseQRCodeData } from '@/lib/services/qrCodeService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingRef = searchParams.get('ref');
    const qrData = searchParams.get('data');

    if (!bookingRef && !qrData) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Booking reference or QR data is required' 
        },
        { status: 400 }
      );
    }

    await connectDB();

    let appointment;

    if (bookingRef) {
      // Verify by booking reference
      appointment = await Appointment.findOne({ 
        bookingReference: bookingRef.toUpperCase() 
      }).populate('assignedAgent', 'fullName position officeName');
    } else if (qrData) {
      // Verify by QR code data
      const parsedData = parseQRCodeData(qrData);
      if (!parsedData) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Invalid QR code data' 
          },
          { status: 400 }
        );
      }

      appointment = await Appointment.findOne({ 
        bookingReference: parsedData.bookingReference 
      }).populate('assignedAgent', 'fullName position officeName');
    }

    if (!appointment) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Appointment not found',
          verified: false 
        },
        { status: 404 }
      );
    }

    // Check if appointment is valid for today
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    
    // Allow appointments from yesterday to tomorrow for flexibility
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 1);

    const isValidDate = appointmentDate >= dayBefore && appointmentDate <= dayAfter;
    const isValidStatus = ['confirmed', 'pending'].includes(appointment.status);

    return NextResponse.json({
      success: true,
      verified: isValidDate && isValidStatus,
      appointment: {
        bookingReference: appointment.bookingReference,
        citizenName: appointment.citizenName,
        citizenNIC: appointment.citizenNIC,
        serviceType: appointment.serviceType,
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        status: appointment.status,
        agent: appointment.assignedAgent ? {
          name: appointment.assignedAgent.fullName,
          position: appointment.assignedAgent.position,
          office: appointment.assignedAgent.officeName
        } : null,
        department: appointment.department,
        priority: appointment.priority
      },
      validation: {
        isValidDate,
        isValidStatus,
        message: !isValidDate 
          ? 'Appointment date is not valid for today' 
          : !isValidStatus 
          ? 'Appointment status is not valid for check-in' 
          : 'Appointment is valid'
      }
    });

  } catch (error) {
    console.error('Appointment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during verification',
        verified: false
      },
      { status: 500 }
    );
  }
}

// POST endpoint for marking appointment as checked in
export async function POST(request: NextRequest) {
  try {
    const { bookingReference, action } = await request.json();

    if (!bookingReference) {
      return NextResponse.json(
        { success: false, message: 'Booking reference is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const appointment = await Appointment.findOne({ 
      bookingReference: bookingReference.toUpperCase() 
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'checkin':
        if (appointment.status !== 'confirmed' && appointment.status !== 'pending') {
          return NextResponse.json(
            { success: false, message: 'Appointment cannot be checked in with current status' },
            { status: 400 }
          );
        }
        
        appointment.status = 'confirmed';
        appointment.lastModifiedBy = 'system_checkin';
        break;

      case 'complete':
        appointment.status = 'completed';
        appointment.completedDate = new Date();
        appointment.lastModifiedBy = 'system_complete';
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    await appointment.save();

    return NextResponse.json({
      success: true,
      message: `Appointment ${action} successful`,
      appointment: {
        bookingReference: appointment.bookingReference,
        status: appointment.status,
        updatedAt: appointment.updatedAt
      }
    });

  } catch (error) {
    console.error('Appointment action error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during appointment action' },
      { status: 500 }
    );
  }
}
