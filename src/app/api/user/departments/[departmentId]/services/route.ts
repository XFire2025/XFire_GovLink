// app/api/user/departments/[departmentId]/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

// Local type for service items returned from the department document
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

// GET /api/user/departments/[departmentId]/services - Fetch services for a specific department (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

  // Extract departmentId from the pathname
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/user\/departments\/([^\/]+)\/services/);
  const departmentId = match ? decodeURIComponent(match[1]) : '';

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
  const activeServices = (department.services as ServiceItem[] | undefined)?.filter((service: ServiceItem) => service.isActive) || [];

    // Transform services for frontend
  const transformedServices = activeServices.map((service: ServiceItem) => ({
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