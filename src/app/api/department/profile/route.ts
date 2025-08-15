import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/profile - Get department profile
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

    const department = await Department.findById(authResult.department!.id).select('-password');

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { department }
    });

  } catch (error) {
    console.error('Get department profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}

// PUT /api/department/profile - Update department profile
export async function PUT(request: NextRequest) {
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

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete body.password;
    delete body.email;
    delete body.departmentId;
    delete body.status;
    delete body.createdBy;

    // Update department
    const updatedDepartment = await Department.findByIdAndUpdate(
      authResult.department!.id,
      { ...body, updatedAt: new Date() },
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
      message: 'Profile updated successfully',
      data: { department: updatedDepartment }
    });

  } catch (error) {
    console.error('Update department profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}