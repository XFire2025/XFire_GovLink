import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/agents - Get department's agents
export async function GET(request: NextRequest) {
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build filter object
    interface FilterType {
      department: string;
      status?: string;
      $or?: Array<Record<string, { $regex: string; $options: string }>>;
    }
    
    const filter: FilterType = { department: authResult.department!.departmentId };
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { officerId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get agents with pagination
    const agents = await Agent.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Agent.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: 'Agents retrieved successfully',
      data: {
        agents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve agents' },
      { status: 500 }
    );
  }
}

// POST /api/department/agents - Create new agent
export async function POST(request: NextRequest) {
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    const body = await request.json();

    // Debug logging to see what data is being sent
    console.log('Creating agent with data:', {
      email: body.email,
      officerId: body.officerId,
      nicNumber: body.nicNumber,
      fullName: body.fullName
    });

    // Validate required fields
    const requiredFields = [
      'fullName', 'officerId', 'nicNumber', 'position', 'officeName',
      'officeAddress', 'phoneNumber', 'email', 'password'
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

    // Check if agent already exists - check each field individually for better error messages
    // Only check within the same department
    const emailExists = await Agent.findOne({ 
      email: body.email.toLowerCase(),
      department: authResult.department!.departmentId 
    });
    const officerIdExists = await Agent.findOne({ 
      officerId: body.officerId,
      department: authResult.department!.departmentId 
    });
    const nicExists = await Agent.findOne({ 
      nicNumber: body.nicNumber,
      department: authResult.department!.departmentId 
    });

    const conflicts = [];
    if (emailExists) conflicts.push(`Email "${body.email}" is already registered in this department`);
    if (officerIdExists) conflicts.push(`Officer ID "${body.officerId}" is already in use in this department`);
    if (nicExists) conflicts.push(`NIC "${body.nicNumber}" is already registered in this department`);

    if (conflicts.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Agent already exists',
          errors: conflicts
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // Create agent with department association
    const agent = new Agent({
      ...body,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      department: authResult.department!.departmentId,
      isActive: true
    });

    await agent.save();

    // Update department's agent count
    await Department.findByIdAndUpdate(authResult.department!.id, {
      $inc: { totalAgents: 1, activeAgents: 1 }
    });

    // Remove password from response
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    return NextResponse.json({
      success: true,
      message: 'Agent created successfully',
      data: { agent: agentResponse }
    }, { status: 201 });

  } catch (error) {
    console.error('Create agent error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Agent already exists',
          errors: ['Duplicate agent information']
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create agent' },
      { status: 500 }
    );
  }
}