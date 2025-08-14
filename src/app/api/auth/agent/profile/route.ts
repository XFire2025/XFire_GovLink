import { NextRequest, NextResponse } from 'next/server';
import { authenticateAgent } from '@/lib/auth/agent-middleware';
import Agent from '@/lib/models/agentSchema';
import connectDB from '@/lib/db';

interface ProfileUpdateData {
  fullName?: string;
  phoneNumber?: string;
  duties?: string[];
  specialization?: string[];
  assignedDistricts?: string[];
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate agent
    const authResult = await authenticateAgent(request);
    
    if (!authResult.success || !authResult.agent) {
      return NextResponse.json(
        { 
          success: false, 
          message: authResult.message,
          errors: [authResult.message]
        },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    // Parse request body
    const updateData: ProfileUpdateData = await request.json();

    // Validate and sanitize update data
    const allowedFields = ['fullName', 'phoneNumber', 'duties', 'specialization', 'assignedDistricts'];
    const filteredData: Partial<ProfileUpdateData> = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        filteredData[key as keyof ProfileUpdateData] = value;
      }
    }

    // Update agent profile
    const updatedAgent = await Agent.findByIdAndUpdate(
      authResult.agent.id,
      {
        ...filteredData,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true,
        select: '-password' // Exclude password from response
      }
    );

    if (!updatedAgent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Agent not found',
          errors: ['Agent profile not found']
        },
        { status: 404 }
      );
    }

    // Return updated agent data
    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile updated successfully',
        agent: {
          id: updatedAgent._id.toString(),
          officerId: updatedAgent.officerId,
          fullName: updatedAgent.fullName,
          email: updatedAgent.email,
          position: updatedAgent.position,
          department: updatedAgent.department || '',
          officeName: updatedAgent.officeName,
          isActive: updatedAgent.isActive,
          assignedDistricts: updatedAgent.assignedDistricts || [],
          phoneNumber: updatedAgent.phoneNumber,
          duties: updatedAgent.duties || [],
          specialization: updatedAgent.specialization || []
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Agent profile update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Failed to update agent profile']
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
