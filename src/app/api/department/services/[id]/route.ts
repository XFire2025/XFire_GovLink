import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/services/[id] - Get specific service
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

    const department = await Department.findById(authResult.department!.id).select('services');

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    const service = department.services.find(service => service.id === id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service retrieved successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve service' },
      { status: 500 }
    );
  }
}

// PUT /api/department/services/[id] - Update service
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

    // Find department and service
    const department = await Department.findById(authResult.department!.id);

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    const serviceIndex = department.services.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Update service fields
    const updatedService = {
      ...department.services[serviceIndex].toObject(),
      ...body,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    // Update the service in the array
    department.services[serviceIndex] = updatedService;
    department.updatedAt = new Date();

    await department.save();

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: { service: updatedService }
    });

  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/department/services/[id] - Delete service
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

    // Find department and remove service
    const department = await Department.findById(authResult.department!.id);

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    const serviceIndex = department.services.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Remove service from array
    department.services.splice(serviceIndex, 1);
    department.updatedAt = new Date();

    await department.save();

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete service' },
      { status: 500 }
    );
  }
}

// PATCH /api/department/services/[id] - Toggle service status
export async function PATCH(
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

    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid status',
          errors: ['isActive must be a boolean value']
        },
        { status: 400 }
      );
    }

    // Find department and service
    const department = await Department.findById(authResult.department!.id);

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    const serviceIndex = department.services.findIndex(service => service.id === id);

    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Update service status
    department.services[serviceIndex].isActive = isActive;
    department.services[serviceIndex].updatedAt = new Date();
    department.updatedAt = new Date();

    await department.save();

    return NextResponse.json({
      success: true,
      message: `Service ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { service: department.services[serviceIndex] }
    });

  } catch (error) {
    console.error('Update service status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update service status' },
      { status: 500 }
    );
  }
}