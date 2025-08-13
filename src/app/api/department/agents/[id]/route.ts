import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/agents/[id] - Get specific agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const agent = await Agent.findOne({
      _id: id,
      department: authResult.department!.departmentId
    }).select('-password');

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agent retrieved successfully',
      data: { agent }
    });

  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve agent' },
      { status: 500 }
    );
  }
}

// PUT /api/department/agents/[id] - Update agent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Find agent and verify it belongs to this department
    const agent = await Agent.findOne({
      _id: id,
      department: authResult.department!.departmentId
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found' },
        { status: 404 }
      );
    }

    // If password is being updated, hash it
    if (body.password) {
      const saltRounds = 12;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    // If email is being updated, check for duplicates within the same department
    if (body.email && body.email !== agent.email) {
      const existingAgent = await Agent.findOne({
        email: body.email.toLowerCase(),
        department: authResult.department!.departmentId,
        _id: { $ne: id }
      });

      if (existingAgent) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Email already in use',
            errors: ['Email is already registered to another agent']
          },
          { status: 409 }
        );
      }
      body.email = body.email.toLowerCase();
    }

    // Prevent changing department through this endpoint
    delete body.department;

    // Track if isActive status is changing
    const wasActive = agent.isActive;
    const willBeActive = body.isActive !== undefined ? body.isActive : wasActive;

    // Update agent
    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, select: '-password' }
    );

    // Update department's active agent count if status changed
    if (wasActive !== willBeActive) {
      const increment = willBeActive ? 1 : -1;
      await Department.findByIdAndUpdate(authResult.department!.id, {
        $inc: { activeAgents: increment }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Agent updated successfully',
      data: { agent: updatedAgent }
    });

  } catch (error) {
    console.error('Update agent error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Duplicate information',
          errors: ['Agent information already exists']
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE /api/department/agents/[id] - Deactivate agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const agent = await Agent.findOne({
      _id: id,
      department: authResult.department!.departmentId
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found' },
        { status: 404 }
      );
    }

    // Instead of hard delete, deactivate the agent
    const wasActive = agent.isActive;
    await Agent.findByIdAndUpdate(id, {
      isActive: false,
      endDate: new Date(),
      updatedAt: new Date()
    });

    // Update department's agent count
    if (wasActive) {
      await Department.findByIdAndUpdate(authResult.department!.id, {
        $inc: { activeAgents: -1 }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Agent deactivated successfully'
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to deactivate agent' },
      { status: 500 }
    );
  }
}