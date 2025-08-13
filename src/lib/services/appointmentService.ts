// lib/services/appointmentService.ts
import { AppointmentStatus, ServiceType } from '@/lib/models/appointmentSchema';

// Types that match your frontend interface
export interface Appointment {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: AppointmentStatus;
  priority: 'normal' | 'urgent';
  notes?: string;
  contactEmail: string;
  contactPhone: string;
  submittedDate: string;
  bookingReference?: string;
  agentNotes?: string;
}

export interface AppointmentFilters {
  search?: string;
  status?: string;
  serviceType?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  urgent: number;
}

class AppointmentService {
  private baseUrl = '/api/agent/appointments';

  // Get all appointments with filtering
  async getAppointments(filters: AppointmentFilters = {}): Promise<{
    success: boolean;
    data?: {
      appointments: Appointment[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasMore: boolean;
      };
    };
    message: string;
    errors?: string[];
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return {
        success: false,
        message: 'Failed to fetch appointments',
        errors: ['Network error or server unavailable']
      };
    }
  }

  // Get single appointment by ID
  async getAppointment(id: string): Promise<{
    success: boolean;
    data?: Appointment & {
      citizen?: any;
      assignedAgent?: any;
      requirements?: string[];
      notificationsSent?: { email: boolean; sms: boolean };
    };
    message: string;
    errors?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return {
        success: false,
        message: 'Failed to fetch appointment',
        errors: ['Network error or server unavailable']
      };
    }
  }

  // Update appointment (status, notes, etc.)
  async updateAppointment(
    id: string, 
    updates: {
      status?: AppointmentStatus;
      agentNotes?: string;
      priority?: 'normal' | 'urgent';
      cancellationReason?: string;
      agentId?: string;
    }
  ): Promise<{
    success: boolean;
    data?: Appointment;
    message: string;
    errors?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      return {
        success: false,
        message: 'Failed to update appointment',
        errors: ['Network error or server unavailable']
      };
    }
  }

  // Send notification to citizen
  async sendNotification(
    id: string, 
    notificationType: 'email' | 'sms' | 'both' = 'both'
  ): Promise<{
    success: boolean;
    data?: {
      notificationType: string;
      sentTo: { email?: string; phone?: string };
      sentAt: string;
    };
    message: string;
    errors?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'sendNotification',
          notificationType,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        message: 'Failed to send notification',
        errors: ['Network error or server unavailable']
      };
    }
  }

  // Get appointment statistics
  async getStats(): Promise<{
    success: boolean;
    data?: {
      overview: AppointmentStats;
      serviceBreakdown: Record<string, number>;
      dailyStats: Array<{ date: string; count: number }>;
    };
    message: string;
    errors?: string[];
  }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'getStats' }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        message: 'Failed to fetch statistics',
        errors: ['Network error or server unavailable']
      };
    }
  }

  // Quick status update (commonly used operation)
  async updateStatus(
    id: string, 
    status: AppointmentStatus, 
    agentId?: string,
    cancellationReason?: string
  ): Promise<{
    success: boolean;
    data?: Appointment;
    message: string;
    errors?: string[];
  }> {
    const updates: any = { status, agentId };
    
    if (status === 'cancelled' && cancellationReason) {
      updates.cancellationReason = cancellationReason;
    }

    return this.updateAppointment(id, updates);
  }

  // Add agent notes
  async addNotes(
    id: string, 
    agentNotes: string, 
    agentId?: string
  ): Promise<{
    success: boolean;
    data?: Appointment;
    message: string;
    errors?: string[];
  }> {
    return this.updateAppointment(id, { agentNotes, agentId });
  }
}

// Create and export a singleton instance
const appointmentService = new AppointmentService();
export default appointmentService;