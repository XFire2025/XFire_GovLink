// app/api/user/departments/[departmentId]/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

// GET /api/user/departments/[departmentId]/services - Fetch services for a specific department
export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    await connectDB();

    const { departmentId } = params;

    // Find department by either _id or departmentId (code)
    const department = await Department.findOne({
      $or: [
        { _id: departmentId },
        { departmentId: departmentId }
      ],
      status: 'ACTIVE'
    }, { services: 1, name: 1, departmentId: 1 });

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Filter only active services
    const activeServices = department.services?.filter(service => service.isActive) || [];

    // Transform services for frontend
    const transformedServices = activeServices.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      processingTime: service.processingTime,
      fee: service.fee || 0,
      requirements: service.requirements || [],
      departmentId: department.departmentId,
      departmentName: department.name
    }));

    return NextResponse.json({
      success: true,
      message: 'Services retrieved successfully',
      data: { 
        services: transformedServices,
        department: {
          id: department._id.toString(),
          code: department.departmentId,
          name: department.name
        }
      }
    });

  } catch (error) {
    console.error('Get department services error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve services' },
      { status: 500 }
    );
  }
}