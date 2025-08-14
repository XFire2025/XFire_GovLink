// app/api/user/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import Department from '@/lib/models/departmentSchema';
import Agent from '@/lib/models/agentSchema';
import User from '@/lib/models/userSchema';
import { uploadFileToR2 } from '@/lib/r2';
import { verifyAccessToken } from '@/lib/auth/user-jwt';

// Define interfaces for better type safety
interface AppointmentFormData {
  departmentId: string;
  serviceId: string;
  agentId: string;
  date: string;
  time: string;
  notes: string;
  priority: string;
}

interface AuthenticatedUser {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  nicNumber?: string;
  email: string;
  mobileNumber?: string;
  phoneNumber?: string;
  accountStatus: string;
}

interface AppointmentFilter {
  citizenId: string;
  status?: string;
}

interface PopulatedAgent {
  _id: string;
  fullName: string;
  position: string;
  officeName: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthenticatedUser;
  statusCode: number;
}

interface UploadedDocument {
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Generate unique booking reference with collision detection
async function generateUniqueBookingReference(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    
    const bookingReference = `APT${year}${month}${day}${random}`;
    
    // Check if this reference already exists
    const existing = await Appointment.findOne({ bookingReference });
    if (!existing) {
      return bookingReference;
    }
    
    attempts++;
  }
  
  // Fallback with timestamp if all attempts fail
  const timestamp = Date.now().toString().slice(-8);
  return `APT${timestamp}`;
}

// Cookie-based authentication helper (matches your existing /me endpoint)
const authenticateWithCookies = async (request: NextRequest): Promise<AuthResult> => {
  try {
    // Get access token from cookies (same as /me endpoint)
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Access token not found',
        statusCode: 401
      };
    }

    // Verify the access token (same as /me endpoint)
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Invalid or expired access token',
        statusCode: 401
      };
    }

    // Connect to database
    await connectDB();

    // Find user in database (same as /me endpoint)
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404
      };
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return {
        success: false,
        message: 'Account is suspended',
        statusCode: 403
      };
    }

    if (user.accountStatus === 'deactivated') {
      return {
        success: false,
        message: 'Account is deactivated',
        statusCode: 403
      };
    }

    return {
      success: true,
      message: 'Authentication successful',
      user: user.toObject() as AuthenticatedUser,
      statusCode: 200
    };

  } catch (error) {
    console.error('Cookie authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed',
      statusCode: 401
    };
  }
};

// POST /api/user/appointments - Create new appointment with file uploads
export async function POST(request: NextRequest) {
  let appointmentData: Partial<AppointmentFormData> = {};
  let user: AuthenticatedUser | null = null;
  
  try {
    // Authenticate user using cookies (same method as /me endpoint)
    const authResult = await authenticateWithCookies(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    user = authResult.user!;
    console.log('✅ User authenticated:', user._id);

    // Connect to database
    await connectDB();

    const formData = await request.formData();
    
    // Extract appointment data
    appointmentData = {
      departmentId: formData.get('departmentId') as string,
      serviceId: formData.get('serviceId') as string,
      agentId: formData.get('agentId') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      notes: formData.get('notes') as string || '',
      priority: formData.get('priority') as string || 'normal'
    };

    console.log('📝 Extracted appointment data:', appointmentData);

    // Validate required fields
    const requiredFields: (keyof AppointmentFormData)[] = ['departmentId', 'serviceId', 'agentId', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          errors: [`Missing fields: ${missingFields.join(', ')}`]
        },
        { status: 400 }
      );
    }

    console.log('🔍 Validating department...');
    
    // Verify department exists and is active
    const department = await Department.findOne({
      $or: [
        { _id: appointmentData.departmentId },
        { departmentId: appointmentData.departmentId }
      ],
      status: 'ACTIVE'
    });

    if (!department) {
      console.error('❌ Department not found:', appointmentData.departmentId);
      return NextResponse.json(
        { success: false, message: 'Department not found or inactive' },
        { status: 404 }
      );
    }

    console.log('✅ Department found:', department.name);

    // Verify service exists in department
    const service = department.services?.find(s => s.id === appointmentData.serviceId && s.isActive);
    if (!service) {
      console.error('❌ Service not found:', appointmentData.serviceId);
      return NextResponse.json(
        { success: false, message: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    console.log('✅ Service found:', service.name);

    // Verify agent exists and is active
    const agent = await Agent.findById(appointmentData.agentId);
    if (!agent || !agent.isActive || agent.department !== department.departmentId) {
      console.error('❌ Agent validation failed:', {
        agentFound: !!agent,
        isActive: agent?.isActive,
        correctDepartment: agent?.department === department.departmentId
      });
      return NextResponse.json(
        { success: false, message: 'Agent not found, inactive, or not in this department' },
        { status: 404 }
      );
    }

    console.log('✅ Agent found:', agent.fullName);

    // Validate appointment date is in the future
    const appointmentDate = new Date(appointmentData.date!);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today
    
    if (appointmentDate <= now) {
      return NextResponse.json(
        { success: false, message: 'Appointment date must be in the future' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts (same agent, same date/time)
    const existingAppointment = await Appointment.findOne({
      assignedAgent: agent._id,
      date: appointmentDate,
      time: appointmentData.time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: 'Time slot is already booked for this agent' },
        { status: 409 }
      );
    }

    // Process file uploads
    const uploadedDocuments: UploadedDocument[] = [];

    // Get all files from formData
    const files = formData.getAll('files') as File[];
    const fileNames = formData.getAll('fileNames') as string[];

    console.log('📎 Processing files:', files.length);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = fileNames[i] || `document_${i + 1}`;

      if (file && file.size > 0) {
        try {
          // Validate file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
              { 
                success: false, 
                message: `File ${file.name} exceeds 5MB size limit`,
                errors: [`File too large: ${file.name}`]
              },
              { status: 400 }
            );
          }

          // Convert file to buffer
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          
          // Generate unique filename
          const timestamp = Date.now();
          const fileName = `${timestamp}-${file.name}`;
          const folderPath = `appointments/${user._id}`;

          console.log('⬆️ Uploading file:', fileName);

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
            console.log('✅ File uploaded:', fileName);
          } else {
            console.error('❌ File upload failed:', uploadResult.message);
            return NextResponse.json(
              { 
                success: false, 
                message: `Failed to upload file: ${file.name}`,
                errors: [uploadResult.message]
              },
              { status: 500 }
            );
          }
        } catch (fileError) {
          console.error('❌ File processing error:', fileError);
          return NextResponse.json(
            { 
              success: false, 
              message: `Error processing file: ${file.name}`,
              errors: [fileError instanceof Error ? fileError.message : 'Unknown file error']
            },
            { status: 500 }
          );
        }
      }
    }

    // Map service category to appointment serviceType enum
    let serviceType: string;
    const categoryLower = service.category.toLowerCase();
    
    // Map categories to valid serviceType enum values
    if (categoryLower.includes('passport')) {
      serviceType = 'passport';
    } else if (categoryLower.includes('license') || categoryLower.includes('driving')) {
      serviceType = 'license';
    } else if (categoryLower.includes('certificate') || categoryLower.includes('birth') || categoryLower.includes('marriage')) {
      serviceType = 'certificate';
    } else if (categoryLower.includes('registration') || categoryLower.includes('business')) {
      serviceType = 'registration';
    } else if (categoryLower.includes('visa')) {
      serviceType = 'visa';
    } else {
      // Default fallback
      serviceType = 'certificate';
    }

    console.log('🔄 Service category mapping:', {
      originalCategory: service.category,
      mappedServiceType: serviceType
    });

    // Generate unique booking reference
    console.log('🎫 Generating booking reference...');
    const bookingReference = await generateUniqueBookingReference();
    console.log('✅ Booking reference generated:', bookingReference);

    // Create appointment
    const newAppointment = new Appointment({
      citizenId: user._id,
      citizenName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      citizenNIC: user.nic || user.nicNumber,
      contactEmail: user.email,
      contactPhone: user.mobileNumber || user.phoneNumber,
      serviceType: serviceType, // Use mapped service type
      department: department.departmentId,
      date: appointmentDate,
      time: appointmentData.time,
      assignedAgent: agent._id,
      assignedOffice: agent.officeName,
      notes: appointmentData.notes,
      priority: appointmentData.priority,
      requirements: service.requirements,
      bookingReference: bookingReference, // Explicitly set the booking reference
      // Store document info in notes for now (you could create a separate documents collection)
      agentNotes: uploadedDocuments.length > 0 
        ? `Uploaded documents: ${uploadedDocuments.map(doc => doc.originalName).join(', ')}`
        : undefined
    });

    console.log('💾 Saving appointment...');
    const savedAppointment = await newAppointment.save();
    console.log('✅ Appointment saved successfully:', savedAppointment._id);

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
    console.error('❌ Create appointment error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type',
      appointmentData: {
        departmentId: appointmentData?.departmentId || 'not set',
        serviceId: appointmentData?.serviceId || 'not set',
        agentId: appointmentData?.agentId || 'not set',
        date: appointmentData?.date || 'not set',
        time: appointmentData?.time || 'not set'
      },
      userId: user?._id || 'not authenticated'
    });
    
    // Return more specific error message based on error type
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { success: false, message: 'Validation error: ' + error.message },
          { status: 400 }
        );
      }
      if (error.message.includes('duplicate') || error.message.includes('E11000')) {
        return NextResponse.json(
          { success: false, message: 'Appointment already exists for this time slot' },
          { status: 409 }
        );
      }
      if (error.message.includes('Cast to ObjectId')) {
        return NextResponse.json(
          { success: false, message: 'Invalid ID format provided' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/user/appointments - Get user's appointments
export async function GET(request: NextRequest) {
  let user: AuthenticatedUser | null = null;
  
  try {
    // Authenticate user using cookies (same method as /me endpoint)
    const authResult = await authenticateWithCookies(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    user = authResult.user!;

    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build filter
    const filter: AppointmentFilter = { citizenId: user._id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    console.log('📋 Fetching appointments for user:', user._id, 'with filter:', filter);

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

    console.log('✅ Found appointments:', appointments.length);

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
        name: (apt.assignedAgent as PopulatedAgent).fullName,
        position: (apt.assignedAgent as PopulatedAgent).position,
        office: (apt.assignedAgent as PopulatedAgent).officeName
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
    console.error('❌ Get appointments error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      userId: user?._id || 'not authenticated'
    });
    
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve appointments' },
      { status: 500 }
    );
  }
}