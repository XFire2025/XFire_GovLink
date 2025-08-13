import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Department, { DepartmentStatus } from '@/lib/models/departmentSchema';

// GET /api/admin/departments/[id] - Get specific department
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const department = await Department.findById(params.id).select('-password');

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Department retrieved successfully',
      data: { department }
    });

  } catch (error) {
    console.error('Get department error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve department' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/departments/[id] - Update department
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    // Find existing department
    const existingDepartment = await Department.findById(params.id);
    if (!existingDepartment) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email/departmentId if they're being changed
    if (body.email && body.email !== existingDepartment.email) {
      const emailExists = await Department.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: params.id }
      });
      if (emailExists) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Email already in use',
            errors: ['Email is already registered']
          },
          { status: 409 }
        );
      }
    }

    // Hash new password if provided
    if (body.password) {
      const saltRounds = 12;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }

    // Update department
    const updatedDepartment = await Department.findByIdAndUpdate(
      params.id,
      {
        ...body,
        email: body.email?.toLowerCase(),
        updatedAt: new Date()
      },
      { new: true, select: '-password' }
    );

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully',
      data: { department: updatedDepartment }
    });

  } catch (error) {
    console.error('Update department error:', error);
    
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
      { success: false, message: 'Failed to update department' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/departments/[id] - Delete department
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const department = await Department.findById(params.id);
    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to INACTIVE
    await Department.findByIdAndUpdate(params.id, {
      status: DepartmentStatus.INACTIVE,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Department deactivated successfully'
    });

  } catch (error) {
    console.error('Delete department error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete department' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/departments/[id] - Update department status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { status } = body;

    if (!Object.values(DepartmentStatus).includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid status',
          errors: ['Status must be ACTIVE, INACTIVE, or SUSPENDED']
        },
        { status: 400 }
      );
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      params.id,
      { status, updatedAt: new Date() },
      { new: true, select: '-password' }
    );

    if (!updatedDepartment) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Department status updated successfully',
      data: { department: updatedDepartment }
    });

  } catch (error) {
    console.error('Update department status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update department status' },
      { status: 500 }
    );
  }
}