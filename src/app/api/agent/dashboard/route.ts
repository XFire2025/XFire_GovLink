import { NextRequest, NextResponse } from 'next/server';
import { verifyAgentAuth } from '@/lib/auth/agent-middleware';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import Submission from '@/lib/models/submissionSchema';

export async function GET(request: NextRequest) {
  try {
    // Verify agent authentication
    const authResult = await verifyAgentAuth(request);
    if (!authResult.isValid || !authResult.agent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const agentId = authResult.agent._id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get appointment statistics for agent-specific dashboard
    const [
      pendingAppointments,
      totalSubmissions,
      todayProcessed,
      confirmedAppointments
    ] = await Promise.all([
      // For now, return mock data consistent with actual appointments (24 pending)
      // TODO: Replace with actual database query when appointments are properly stored
      Promise.resolve(24), // Pending appointments to match actual count
      
      // For now, return mock data consistent with submissions page (4 total submissions)
      // TODO: Replace with actual database query when submissions are properly stored
      Promise.resolve(4), // Total submissions to match mockSubmissions array length
      
      // Today processed by this agent (mock data)
      Promise.resolve(8), // Today processed appointments
      
      // Confirmed appointments (mock data for active chats representation)
      Promise.resolve(3) // Active chats/confirmed appointments
    ]);

    // Mock trend data for consistency
    const lastWeekPending = 20; // Previous week pending count
    const lastWeekSubmissions = 3; // Previous week submissions
    const lastWeekProcessed = 6; // Previous week processed

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = Math.round(((current - previous) / previous) * 100);
      return `${change >= 0 ? '+' : ''}${change}%`;
    };

    const stats = {
      pendingAppointments: {
        value: pendingAppointments.toString(),
        trend: {
          value: calculateChange(pendingAppointments, lastWeekPending),
          isPositive: pendingAppointments >= lastWeekPending
        }
      },
      newSubmissions: {
        value: totalSubmissions.toString(),
        trend: {
          value: calculateChange(totalSubmissions, lastWeekSubmissions),
          isPositive: totalSubmissions >= lastWeekSubmissions
        }
      },
      confirmedAppointments: {
        value: confirmedAppointments.toString(),
        trend: {
          value: 'Scheduled',
          isPositive: true
        }
      },
      todayProcessed: {
        value: todayProcessed.toString(),
        trend: {
          value: calculateChange(todayProcessed, lastWeekProcessed),
          isPositive: todayProcessed >= lastWeekProcessed
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching agent dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}