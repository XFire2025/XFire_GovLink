// app/api/user/departments/[departmentId]/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import Department from '@/lib/models/departmentSchema';

// Type for MongoDB query filter
interface AgentFilter {
  department: string;
  isActive: boolean;
  position?: {
    $regex: string;
    $options: string;
  };
}

// GET /api/user/departments/[departmentId]/agents - Fetch agents for a specific department (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    await connectDB();

    const { departmentId } = params;
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position'); // Filter by position/designation

    // First, get the department to get its code
    const department = await Department.findOne({
      $or: [
        { _id: departmentId },
        { departmentId: departmentId }
      ],
      status: 'ACTIVE'
    }, { departmentId: 1, name: 1 });

    if (!department) {
      return NextResponse.json(
        { success: false, message: 'Department not found' },
        { status: 404 }
      );
    }

    // Build agent filter
    const agentFilter: AgentFilter = {
      department: department.departmentId, // Match using department code
      isActive: true
    };

    if (position) {
      agentFilter.position = { $regex: position, $options: 'i' };
    }

    // Fetch active agents for this department
    const agents = await Agent.find(agentFilter, {
      fullName: 1,
      officerId: 1,
      position: 1,
      officeName: 1,
      email: 1,
      phoneNumber: 1,
      specialization: 1,
      duties: 1,
      isActive: 1
    }).sort({ fullName: 1 });

    // Transform agents for frontend
    const transformedAgents = agents.map(agent => ({
      id: agent._id.toString(),
      name: agent.fullName,
      officerId: agent.officerId,
      position: agent.position,
      officeName: agent.officeName,
      email: agent.email,
      phone: agent.phoneNumber,
      specialization: agent.specialization || [],
      duties: agent.duties || [],
      departmentCode: department.departmentId,
      departmentName: department.name
    }));

    // Group agents by position for easier selection
    const agentsByPosition = transformedAgents.reduce((acc, agent) => {
      const position = agent.position;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(agent);
      return acc;
    }, {} as Record<string, typeof transformedAgents>);

    return NextResponse.json({
      success: true,
      message: 'Agents retrieved successfully',
      data: { 
        agents: transformedAgents,
        agentsByPosition,
        department: {
          id: department._id.toString(),
          code: department.departmentId,
          name: department.name
        }
      }
    });

  } catch (error) {
    console.error('Get department agents error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve agents' },
      { status: 500 }
    );
  }
}