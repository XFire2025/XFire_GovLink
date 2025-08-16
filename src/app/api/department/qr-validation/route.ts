// src/app/api/department/qr-validation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

interface ParsedQRData {
  ref: string;
  name: string;
  service: string;
  dept: string;
  date: string;
  time: string;
  agent: string;
  office: string;
  verify: string;
  generated: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate department user
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    const departmentUser = authResult.department!;
    const { qrData, departmentId } = await request.json();

    console.log('🔍 QR Validation Request:', {
      qrData: qrData?.substring(0, 100) + '...',
      requestingDepartment: departmentId,
      authenticatedDepartment: departmentUser.departmentId
    });

    if (!qrData) {
      return NextResponse.json(
        { success: false, message: 'QR code data is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Parse QR code data
    let parsedQRData: ParsedQRData;
    try {
      const parsed = JSON.parse(qrData);
      if (!parsed || !parsed.ref) {
        throw new Error('Invalid QR code format - missing booking reference');
      }
      parsedQRData = parsed as ParsedQRData;
    } catch (error) {
      console.error('❌ QR parsing error:', error);
      return NextResponse.json({
        success: false,
        message: 'Invalid QR code format',
        timeStatus: 'expired',
        departmentMatch: false
      });
    }

    console.log('📋 Parsed QR Data:', parsedQRData);

    // Find appointment by booking reference
    const appointment = await Appointment.findOne({
      bookingReference: parsedQRData.ref
    }).populate('citizenId', 'firstName lastName email');

    if (!appointment) {
      console.log('❌ Appointment not found:', parsedQRData.ref);
      return NextResponse.json({
        success: false,
        message: 'Appointment not found',
        timeStatus: 'expired',
        departmentMatch: false
      });
    }

    console.log('📅 Found appointment:', {
      ref: appointment.bookingReference,
      status: appointment.status,
      date: appointment.date,
      time: appointment.time,
      department: appointment.department
    });

    // Check if appointment is cancelled
    if (appointment.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has been cancelled',
        appointment: {
          bookingReference: appointment.bookingReference,
          citizenName: appointment.citizenName,
          serviceType: appointment.serviceType,
          date: appointment.date.toISOString().split('T')[0],
          time: appointment.time,
          status: appointment.status,
          department: appointment.department
        },
        timeStatus: 'expired',
        departmentMatch: false
      });
    }

    // Check if appointment is already completed
    if (appointment.status === 'completed') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has already been completed',
        appointment: {
          bookingReference: appointment.bookingReference,
          citizenName: appointment.citizenName,
          serviceType: appointment.serviceType,
          date: appointment.date.toISOString().split('T')[0],
          time: appointment.time,
          status: appointment.status,
          department: appointment.department
        },
        timeStatus: 'expired',
        departmentMatch: true
      });
    }

    // Validate department match
    const departmentMatch = appointment.department === departmentUser.departmentId || 
                           appointment.department === departmentUser.id ||
                           !appointment.department; // Allow if no specific department assigned

    if (!departmentMatch) {
      console.log('❌ Department mismatch:', {
        appointmentDept: appointment.department,
        userDept: departmentUser.departmentId,
        userId: departmentUser.id
      });
      return NextResponse.json({
        success: false,
        message: 'This appointment is not for your department',
        appointment: {
          bookingReference: appointment.bookingReference,
          citizenName: appointment.citizenName,
          serviceType: appointment.serviceType,
          date: appointment.date.toISOString().split('T')[0],
          time: appointment.time,
          status: appointment.status,
          department: appointment.department
        },
        timeStatus: 'valid',
        departmentMatch: false
      });
    }

    // Validate time window (1 hour before to 15 minutes after)
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date.toISOString().split('T')[0]}T${appointment.time}:00`);
    const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000); // 1 hour before
    const fifteenMinutesAfter = new Date(appointmentDateTime.getTime() + 15 * 60 * 1000); // 15 minutes after

    console.log('⏰ Time validation:', {
      now: now.toISOString(),
      appointment: appointmentDateTime.toISOString(),
      windowStart: oneHourBefore.toISOString(),
      windowEnd: fifteenMinutesAfter.toISOString()
    });

    let timeStatus: 'early' | 'valid' | 'late' | 'expired';
    let timeMessage = '';

    if (now < oneHourBefore) {
      timeStatus = 'early';
      timeMessage = 'Too early - you can check in 1 hour before your appointment';
    } else if (now > fifteenMinutesAfter) {
      timeStatus = 'late';
      timeMessage = 'Too late - check-in window has closed (15 minutes after appointment time)';
    } else {
      timeStatus = 'valid';
      timeMessage = 'Valid time window for check-in';
    }

    // If time is not valid, return error with details
    if (timeStatus !== 'valid') {
      return NextResponse.json({
        success: false,
        message: timeMessage,
        appointment: {
          bookingReference: appointment.bookingReference,
          citizenName: appointment.citizenName,
          serviceType: appointment.serviceType,
          date: appointment.date.toISOString().split('T')[0],
          time: appointment.time,
          status: appointment.status,
          department: appointment.department
        },
        timeStatus,
        departmentMatch
      });
    }

    // All validations passed - appointment is valid
    console.log('✅ QR code validation successful');

    return NextResponse.json({
      success: true,
      message: 'Valid appointment - ready for check-in',
      appointment: {
        bookingReference: appointment.bookingReference,
        citizenName: appointment.citizenName,
        serviceType: appointment.serviceType,
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        status: appointment.status,
        department: appointment.department
      },
      timeStatus,
      departmentMatch
    });

  } catch (error) {
    console.error('❌ QR validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Validation failed',
        timeStatus: 'expired',
        departmentMatch: false
      },
      { status: 500 }
    );
  }
}
