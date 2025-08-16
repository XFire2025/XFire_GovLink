// src/lib/services/departmentApiService.ts

export interface DepartmentStats {
  totalSubmissions: number;
  todaySubmissions: number;
  monthSubmissions: number;
  pendingSubmissions: number;
  totalAgents: number;
  activeAgents: number;
  serviceUptime: number;
  totalServices: number;
  activeServices: number;
}

export interface RecentSubmission {
  submissionId: string;
  title: string;
  applicantName: string;
  status: string;
  submittedAt: string;
  priority: string;
}

export interface DashboardData {
  stats: DepartmentStats;
  changes: {
    submissionChange: string;
  };
  statusDistribution: Record<string, number>;
  recentSubmissions: RecentSubmission[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  requirements: string[];
  processingTime: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: string;
  specialization: string[];
  workload: number;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  officerId?: string;
  nicNumber?: string;
  position?: string;
  officeName?: string;
  officeAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
  };
  phoneNumber?: string;
  password?: string;
  isActive?: boolean;
  duties?: string[];
}

export interface Submission {
  id: string;
  submissionId: string;
  title: string;
  applicantName: string;
  applicantEmail: string;
  status: string;
  priority: string;
  serviceId: string;
  agentId?: string;
  agentName?: string;
  agentEmail?: string;
  agentStatus?: string;
  submittedAt: string;
  updatedAt: string;
  // Additional appointment-specific fields
  appointmentDate?: string;
  appointmentTime?: string;
  bookingReference?: string;
  contactPhone?: string;
  citizenNIC?: string;
}

export interface DepartmentProfile {
  id: string;
  departmentId: string;
  name: string;
  email: string;
  status: string;
  type: string;
}

export interface AnalyticsData {
  period: string;
  totalSubmissions: number;
  submissionTrends: Array<{ date: string; count: number }>;
  statusBreakdown: Record<string, number>;
  agentPerformance: Array<{ agentId: string; name: string; completed: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class DepartmentApiService {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('department_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          // Redirect to login
          window.location.href = '/department/login';
          throw new Error('Authentication failed');
        }
        // Retry the original request would require recursive logic
        throw new Error('Token expired - please retry');
      }
      
      // Enhanced error handling - include specific error details
      const errorMessage = data.message || 'Request failed';
      const errorDetails = data.errors ? `\n${data.errors.join('\n')}` : '';
      throw new Error(errorMessage + errorDetails);
    }
    
    return data;
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('department_refresh_token');
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/department/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('department_access_token', data.tokens.accessToken);
        localStorage.setItem('department_refresh_token', data.tokens.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    // Clear invalid tokens
    localStorage.removeItem('department_access_token');
    localStorage.removeItem('department_refresh_token');
    return false;
  }

  // Dashboard API
  static async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await fetch('/api/department/dashboard', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<DashboardData>(response);
    } catch (error) {
      console.error('Get dashboard data error:', error);
      throw error;
    }
  }

  // Analytics API
  static async getAnalytics(period: string = '30'): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await fetch(`/api/department/analytics?period=${period}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<AnalyticsData>(response);
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  // Services API
  static async getServices(filters?: {
    isActive?: boolean;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<{ services: Service[] }>> {
    try {
      const searchParams = new URLSearchParams();
      if (filters?.isActive !== undefined) searchParams.set('isActive', filters.isActive.toString());
      if (filters?.category) searchParams.set('category', filters.category);
      if (filters?.search) searchParams.set('search', filters.search);

      const response = await fetch(`/api/department/services?${searchParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ services: Service[] }>(response);
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  }

  static async getService(id: string): Promise<ApiResponse<{ service: Service }>> {
    try {
      const response = await fetch(`/api/department/services/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ service: Service }>(response);
    } catch (error) {
      console.error('Get service error:', error);
      throw error;
    }
  }

  static async createService(serviceData: Partial<Service>): Promise<ApiResponse<{ service: Service }>> {
    try {
      const response = await fetch('/api/department/services', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      
      return await this.handleResponse<{ service: Service }>(response);
    } catch (error) {
      console.error('Create service error:', error);
      throw error;
    }
  }

  static async updateService(id: string, serviceData: Partial<Service>): Promise<ApiResponse<{ service: Service }>> {
    try {
      const response = await fetch(`/api/department/services/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      
      return await this.handleResponse<{ service: Service }>(response);
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  }

  static async deleteService(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`/api/department/services/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<null>(response);
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  }

  static async toggleServiceStatus(id: string, isActive: boolean): Promise<ApiResponse<{ service: Service }>> {
    try {
      const response = await fetch(`/api/department/services/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });
      
      return await this.handleResponse<{ service: Service }>(response);
    } catch (error) {
      console.error('Toggle service status error:', error);
      throw error;
    }
  }

  // Agents API
  static async getAgents(filters?: {
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ agents: Agent[] }>> {
    try {
      const searchParams = new URLSearchParams();
      if (filters?.status) searchParams.set('status', filters.status);
      if (filters?.search) searchParams.set('search', filters.search);

      const response = await fetch(`/api/department/agents?${searchParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ agents: Agent[] }>(response);
    } catch (error) {
      console.error('Get agents error:', error);
      throw error;
    }
  }

  static async getAgent(id: string): Promise<ApiResponse<{ agent: Agent }>> {
    try {
      const response = await fetch(`/api/department/agents/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ agent: Agent }>(response);
    } catch (error) {
      console.error('Get agent error:', error);
      throw error;
    }
  }

  static async createAgent(agentData: Partial<Agent>): Promise<ApiResponse<{ agent: Agent }>> {
    try {
      const response = await fetch('/api/department/agents', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(agentData),
      });
      
      return await this.handleResponse<{ agent: Agent }>(response);
    } catch (error) {
      console.error('Create agent error:', error);
      throw error;
    }
  }

  static async updateAgent(id: string, agentData: Partial<Agent>): Promise<ApiResponse<{ agent: Agent }>> {
    try {
      const response = await fetch(`/api/department/agents/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(agentData),
      });
      
      return await this.handleResponse<{ agent: Agent }>(response);
    } catch (error) {
      console.error('Update agent error:', error);
      throw error;
    }
  }

  static async deleteAgent(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`/api/department/agents/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<null>(response);
    } catch (error) {
      console.error('Delete agent error:', error);
      throw error;
    }
  }

  // Submissions API
  static async getSubmissions(filters?: {
    status?: string;
    priority?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ submissions: Submission[]; total: number }>> {
    try {
      const searchParams = new URLSearchParams();
      if (filters?.status) searchParams.set('status', filters.status);
      if (filters?.priority) searchParams.set('priority', filters.priority);
      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.limit) searchParams.set('limit', filters.limit.toString());
      
      // Convert offset to page number (API expects page, not offset)
      if (filters?.offset !== undefined && filters?.limit) {
        const page = Math.floor(filters.offset / filters.limit) + 1;
        searchParams.set('page', page.toString());
      } else if (filters?.offset === 0 || !filters?.offset) {
        searchParams.set('page', '1');
      }

      const response = await fetch(`/api/department/submissions?${searchParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ submissions: Submission[]; total: number }>(response);
    } catch (error) {
      console.error('Get submissions error:', error);
      throw error;
    }
  }

  static async getSubmission(id: string): Promise<ApiResponse<{ submission: Submission }>> {
    try {
      const response = await fetch(`/api/department/submissions/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ submission: Submission }>(response);
    } catch (error) {
      console.error('Get submission error:', error);
      throw error;
    }
  }

  static async updateSubmission(id: string, submissionData: Partial<Submission>): Promise<ApiResponse<{ submission: Submission }>> {
    try {
      const response = await fetch(`/api/department/submissions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submissionData),
      });
      
      return await this.handleResponse<{ submission: Submission }>(response);
    } catch (error) {
      console.error('Update submission error:', error);
      throw error;
    }
  }

  // Profile API
  static async getProfile(): Promise<ApiResponse<{ department: DepartmentProfile }>> {
    try {
      const response = await fetch('/api/department/profile', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse<{ department: DepartmentProfile }>(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  static async updateProfile(profileData: Partial<DepartmentProfile>): Promise<ApiResponse<{ department: DepartmentProfile }>> {
    try {
      const response = await fetch('/api/department/profile', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      
      return await this.handleResponse<{ department: DepartmentProfile }>(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

export default DepartmentApiService;
