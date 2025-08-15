import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';

// GET /api/department/services - Get department's services
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
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Get department with services
    const department = await Department.findById(authResult.department!.id).select('services');

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    let services = department.services || [];

    // Apply filters
    if (isActive !== null && isActive !== undefined) {
      services = services.filter((service: { isActive: boolean }) => service.isActive === (isActive === 'true'));
    }

    if (category) {
      services = services.filter((service: { category: string }) => 
        service.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      services = services.filter((service: { name: string, description: string }) =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Services retrieved successfully',
      data: { services }
    });

  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve services' },
      { status: 500 }
    );
  }
}

// POST /api/department/services - Create new service
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

    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'processingTime'];
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

    // Generate unique service ID
    const serviceId = `SVC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newService = {
      id: serviceId,
      name: body.name.trim(),
      description: body.description.trim(),
      category: body.category.trim(),
      processingTime: body.processingTime.trim(),
      fee: body.fee || 0,
      requirements: body.requirements || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add service to department
    const updatedDepartment = await Department.findByIdAndUpdate(
      authResult.department!.id,
      { 
        $push: { services: newService },
        updatedAt: new Date()
      },
      { new: true, select: 'services' }
    );

    if (!updatedDepartment) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Find the newly created service
    const createdService = updatedDepartment.services.find((service: { id: string }) => service.id === serviceId);

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: { service: createdService }
    }, { status: 201 });

  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create service' },
      { status: 500 }
    );
  }
}