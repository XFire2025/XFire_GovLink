// app/api/user/departments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

// Local type for department services to avoid implicit any in callbacks
interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  processingTime?: string;
  fee?: number;
  requirements?: string[];
}

// GET /api/user/departments - Fetch all active departments for users (public endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API: /api/user/departments called');
    await connectDB();
    console.log('✅ Database connected');

    const { searchParams } = new URL(request.url);
    const includeServices = searchParams.get('includeServices') === 'true';
    console.log('🔍 Include services:', includeServices);

    // Fetch departments with active status (checking both cases)
    const departments = await Department.find(
      { 
        $or: [
          { status: 'ACTIVE' },
          { status: 'active' }
        ]
      },
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

    console.log('📊 Found departments:', departments.length);
    console.log('📋 Department data:', departments.map(d => ({ id: d._id, name: d.name, status: d.status })));

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
        services: (dept.services as ServiceItem[] | undefined)?.filter((service: ServiceItem) => service.isActive).map((service: ServiceItem) => ({
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

    console.log('✅ Transformed departments for frontend:', transformedDepartments.length);

    return NextResponse.json({
      success: true,
      message: 'Departments retrieved successfully',
      data: { departments: transformedDepartments }
    });

  } catch (error) {
    console.error('❌ Get departments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve departments' },
      { status: 500 }
    );
  }
}