// app/api/user/departments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

// GET /api/user/departments - Fetch all active departments for users
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeServices = searchParams.get('includeServices') === 'true';

    // Fetch only active departments
    const departments = await Department.find(
      { status: 'ACTIVE' },
      {
        _id: 1,
        departmentId: 1,
        name: 1,
        shortName: 1,
        description: 1,
        email: 1,
        phoneNumber: 1,
        address: 1,
        workingHours: 1,
        allowOnlineServices: 1,
        requiresAppointment: 1,
        ...(includeServices && { services: 1 })
      }
    ).sort({ name: 1 });

    // Transform departments for frontend
    const transformedDepartments = departments.map(dept => ({
      id: dept._id.toString(),
      code: dept.departmentId,
      name: dept.name,
      shortName: dept.shortName,
      description: dept.description,
      email: dept.email,
      phone: dept.phoneNumber,
      address: dept.address,
      workingHours: dept.workingHours,
      allowOnlineServices: dept.allowOnlineServices,
      requiresAppointment: dept.requiresAppointment,
      ...(includeServices && {
        services: dept.services?.filter(service => service.isActive).map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          category: service.category,
          processingTime: service.processingTime,
          fee: service.fee || 0,
          requirements: service.requirements || []
        })) || []
      })
    }));

    return NextResponse.json({
      success: true,
      message: 'Departments retrieved successfully',
      data: { departments: transformedDepartments }
    });

  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve departments' },
      { status: 500 }
    );
  }
}