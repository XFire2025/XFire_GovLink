import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';
import Agent from '@/lib/models/agentSchema';

// GET /api/public/directory - Get all departments and agents (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeDepartments = searchParams.get('departments') !== 'false';
    const includeAgents = searchParams.get('agents') !== 'false';
    const search = searchParams.get('search');
    const district = searchParams.get('district');
    const departmentType = searchParams.get('type');

    const result: {
      departments?: unknown[];
      agents?: unknown[];
      summary?: {
        totalDepartments: number;
        totalAgents: number;
        activeDepartments: number;
        activeAgents: number;
      };
    } = {};

    // Get departments if requested
    if (includeDepartments) {
      const departmentFilter: Record<string, unknown> = {
        status: 'ACTIVE' // Only show active departments publicly
      };

      if (district) departmentFilter['address.district'] = district;
      if (departmentType) departmentFilter.type = departmentType;
      if (search) {
        departmentFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { departmentId: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
          { 'address.district': { $regex: search, $options: 'i' } }
        ];
      }

      const departments = await Department.find(departmentFilter)
        .select('departmentId name type email phone address totalAgents activeAgents services createdAt')
        .sort({ name: 1 })
        .lean();

      result.departments = departments;
    }

    // Get agents if requested
    if (includeAgents) {
      const agentFilter: Record<string, unknown> = {
        status: 'ACTIVE' // Only show active agents publicly
      };

      if (search) {
        agentFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by department if specified
      if (district || departmentType) {
        // First get matching departments
        const deptFilter: Record<string, unknown> = {};
        if (district) deptFilter['address.district'] = district;
        if (departmentType) deptFilter.type = departmentType;
        
        const matchingDepts = await Department.find(deptFilter)
          .select('departmentId')
          .lean();
        
        const deptIds = matchingDepts.map(dept => dept.departmentId);
        if (deptIds.length > 0) {
          agentFilter.department = { $in: deptIds };
        } else {
          // No matching departments, so no agents
          result.agents = [];
        }
      }

      if (!result.agents) {
        const agents = await Agent.find(agentFilter)
          .select('agentId name email department specialization languages availableHours createdAt')
          .sort({ name: 1 })
          .lean();

        result.agents = agents;
      }
    }

    // Calculate summary statistics
    const [totalDepartments, activeDepartments, totalAgents, activeAgents] = await Promise.all([
      Department.countDocuments({}),
      Department.countDocuments({ status: 'ACTIVE' }),
      Agent.countDocuments({}),
      Agent.countDocuments({ status: 'ACTIVE' })
    ]);

    result.summary = {
      totalDepartments,
      activeDepartments,
      totalAgents,
      activeAgents
    };

    return NextResponse.json({
      success: true,
      message: 'Directory retrieved successfully',
      data: result
    });

  } catch (error) {
    console.error('Public directory error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve directory',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
