// app/api/user/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import Department from '@/lib/models/departmentSchema';
import Agent from '@/lib/models/agentSchema';
import { uploadFileToR2 } from '@/lib/r2';
import { authenticate } from '@/lib/auth/user-middleware';
import User from '@/lib/models/userSchema';

// POST /api/user/appointments - Create new appointment with file uploads
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    // Get full user data
    const user = await User.findById(authResult.user!.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    
    // Extract appointment data
    const appointmentData = {
      departmentId: formData.get('departmentId') as string,
      serviceId: formData.get('serviceId') as string,
      agentId: formData.get('agentId') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      notes: formData.get('notes') as string || '',
      priority: formData.get('priority') as string || 'normal'
    };

    // Validate required fields
    const requiredFields = ['departmentId', 'serviceId', 'agentId', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !appointmentData[field as keyof typeof appointmentData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          errors: [`Missing fields: ${missingFields.join(', ')}`]
        },
        { status: 400 }
      );
    }

    // Verify department exists and is active
    const department = await Department.findOne({
      $or: [
        { _id: appointmentData.departmentId },
        { departmentId: appointmentData.departmentId }
      ],
      status: 'ACTIVE'
    });

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found or inactive' },
        { status: 404 }
      );
    }

    // Verify service exists in department
    const service = department.services?.find(s => s.id === appointmentData.serviceId && s.isActive);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Verify agent exists and is active
    const agent = await Agent.findById(appointmentData.agentId);
    if (!agent || !agent.isActive || agent.department !== department.departmentId) {
      return NextResponse.json(
        { success: false, message: 'Agent not found, inactive, or not in this department' },
        { status: 404 }
      );
    }

    // Process file uploads
    const uploadedDocuments: Array<{
      name: string;
      originalName: string;
      url: string;
      type: string;
      size: number;
      uploadedAt: Date;
    }> = [];

    // Get all files from formData
    const files = formData.getAll('files') as File[];
    const fileNames = formData.getAll('fileNames') as string[];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = fileNames[i] || `document_${i + 1}`;

      if (file && file.size > 0) {
        // Convert file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const folderPath = `appointments/${user._id}`;

        // Upload to R2
        const uploadResult = await uploadFileToR2(
          fileBuffer,
          fileName,
          file.type,
          folderPath
        );

        if (uploadResult.success) {
          uploadedDocuments.push({
            name: documentName,
            originalName: file.name,
            url: uploadResult.url!,
            type: file.type,
            size: file.size,
            uploadedAt: new Date()
          });
        } else {
          return NextResponse.json(
            { 
              success: false, 
              message: `Failed to upload file: ${file.name}`,
              errors: [uploadResult.message]
            },
            { status: 500 }
          );
        }
      }
    }

    // Create appointment
    const newAppointment = new Appointment({
      citizenId: user._id,
      citizenName: user.fullName,
      citizenNIC: user.nicNumber,
      contactEmail: user.email,
      contactPhone: user.mobileNumber,
      serviceType: service.category.toLowerCase() as any, // Map to enum
      department: department.departmentId,
      date: new Date(appointmentData.date),
      time: appointmentData.time,
      assignedAgent: agent._id,
      assignedOffice: agent.officeName,
      notes: appointmentData.notes,
      priority: appointmentData.priority,
      requirements: service.requirements,
      // Store document info in notes for now (you could create a separate documents collection)
      agentNotes: uploadedDocuments.length > 0 
        ? `Uploaded documents: ${uploadedDocuments.map(doc => doc.originalName).join(', ')}`
        : undefined
    });

    const savedAppointment = await newAppointment.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        appointment: {
          id: savedAppointment._id.toString(),
          bookingReference: savedAppointment.bookingReference,
          citizenName: savedAppointment.citizenName,
          serviceType: service.name,
          department: department.name,
          agent: agent.fullName,
          agentPosition: agent.position,
          date: savedAppointment.date.toISOString().split('T')[0],
          time: savedAppointment.time,
          status: savedAppointment.status,
          notes: savedAppointment.notes,
          uploadedDocuments: uploadedDocuments.map(doc => ({
            name: doc.name,
            originalName: doc.originalName,
            size: doc.size,
            type: doc.type
          }))
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// GET /api/user/appointments - Get user's appointments
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    // Get full user data
    const user = await User.findById(authResult.user!.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build filter
    const filter: any = { citizenId: user._id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    // Fetch appointments
    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter)
        .populate('assignedAgent', 'fullName position officeName')
        .sort({ submittedDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter)
    ]);

    // Transform appointments
    const transformedAppointments = appointments.map(apt => ({
      id: apt._id.toString(),
      bookingReference: apt.bookingReference,
      serviceType: apt.serviceType,
      department: apt.department,
      date: apt.date.toISOString().split('T')[0],
      time: apt.time,
      status: apt.status,
      priority: apt.priority,
      notes: apt.notes,
      assignedAgent: apt.assignedAgent ? {
        name: (apt.assignedAgent as any).fullName,
        position: (apt.assignedAgent as any).position,
        office: (apt.assignedAgent as any).officeName
      } : null,
      submittedDate: apt.submittedDate.toISOString().split('T')[0]
    }));

    return NextResponse.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: {
        appointments: transformedAppointments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit
        }
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