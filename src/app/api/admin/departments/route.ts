import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Department, { DepartmentStatus } from '@/lib/models/departmentSchema';
import { authRateLimit } from '@/lib/auth/user-middleware';

// GET /api/admin/departments - Get all departments
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const district = searchParams.get('district');

    // Build filter object
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (district) filter['address.district'] = district;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { departmentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get departments with pagination
    const departments = await Department.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Department.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: 'Departments retrieved successfully',
      data: {
        departments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve departments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/departments - Create new department
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: rateLimitResult.statusCode }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name', 'shortName', 'description', 'type', 'email', 'password',
      'phoneNumber', 'address', 'headOfDepartment'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
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

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format',
          errors: ['Email format is invalid']
        },
        { status: 400 }
      );
    }

    // Check if department already exists
    const existingDepartment = await Department.findOne({
      $or: [
        { email: body.email.toLowerCase() },
        { departmentId: body.departmentId }
      ]
    });

    if (existingDepartment) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Department already exists',
          errors: ['Email or Department ID already in use']
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // Generate department ID if not provided
    if (!body.departmentId) {
      const prefix = body.type.substring(0, 3).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      body.departmentId = `${prefix}${timestamp}`;
    }

    // Create department
    const department = new Department({
      ...body,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      status: body.status || DepartmentStatus.ACTIVE,
      createdBy: body.createdBy || 'admin' // Should come from authenticated admin
    });

    await department.save();

    // Remove password from response
    const departmentResponse = department.toObject();
    delete departmentResponse.password;

    return NextResponse.json({
      success: true,
      message: 'Department created successfully',
      data: { department: departmentResponse }
    }, { status: 201 });

  } catch (error) {
    console.error('Create department error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Department already exists',
          errors: ['Duplicate department information']
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create department' },
      { status: 500 }
    );
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