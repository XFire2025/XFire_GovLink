// // lib/services/userApiService.ts

// export interface Department {
//   id: string;
//   code: string;
//   name: string;
//   shortName: string;
//   description: string;
//   email: string;
//   phone: string;
//   address: {
//     addressLine1: string;
//     addressLine2?: string;
//     city: string;
//     district: string;
//     province: string;
//     postalCode: string;
//   };
//   workingHours: {
//     [key: string]: {
//       open: string;
//       close: string;
//       isWorkingDay: boolean;
//     };
//   };
//   allowOnlineServices: boolean;
//   requiresAppointment: boolean;
//   services?: Service[];
// }

// export interface Service {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   processingTime: string;
//   fee: number;
//   requirements: string[];
//   departmentId?: string;
//   departmentName?: string;
// }

// export interface Agent {
//   id: string;
//   name: string;
//   officerId: string;
//   position: string;
//   officeName: string;
//   email: string;
//   phone: string;
//   specialization: string[];
//   duties: string[];
//   departmentCode: string;
//   departmentName: string;
// }

// export interface AppointmentCreate {
//   departmentId: string;
//   serviceId: string;
//   agentId: string;
//   date: string;
//   time: string;
//   notes?: string;
//   priority?: 'normal' | 'urgent';
//   files?: File[];
//   fileNames?: string[];
// }

// export interface Appointment {
//   id: string;
//   bookingReference: string;
//   serviceType: string;
//   department: string;
//   date: string;
//   time: string;
//   status: string;
//   priority: string;
//   notes?: string;
//   assignedAgent?: {
//     name: string;
//     position: string;
//     office: string;
//   };
//   submittedDate: string;
//   uploadedDocuments?: Array<{
//     name: string;
//     originalName: string;
//     size: number;
//     type: string;
//   }>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data?: T;
//   errors?: string[];
// }

// class UserApiService {
//   private static getAuthHeaders(): Record<string, string> {
//     const token = localStorage.getItem('user_access_token');
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   }

//   private static getAuthHeadersForFormData(): Record<string, string> {
//     const token = localStorage.getItem('user_access_token');
//     return {
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   }

//   private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
//     const data = await response.json();
    
//     if (!response.ok) {
//       // Handle token expiration - DON'T redirect immediately, let component handle it
//       if (response.status === 401) {
//         console.error('🔐 Authentication failed - user needs to login');
//         throw new Error('Authentication required. Please login first.');
//       }
      
//       const errorMessage = data.message || 'Request failed';
//       const errorDetails = data.errors ? `\n${data.errors.join('\n')}` : '';
//       throw new Error(errorMessage + errorDetails);
//     }
    
//     return data;
//   }

//   static async refreshToken(): Promise<boolean> {
//     try {
//       const refreshToken = localStorage.getItem('user_refresh_token');
//       if (!refreshToken) return false;

//       const response = await fetch('/api/auth/user/refresh', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('user_access_token', data.tokens.accessToken);
//         localStorage.setItem('user_refresh_token', data.tokens.refreshToken);
//         return true;
//       }
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//     }
    
//     // Clear invalid tokens
//     localStorage.removeItem('user_access_token');
//     localStorage.removeItem('user_refresh_token');
//     return false;
//   }

//   // Departments API (public endpoint)
//   static async getDepartments(includeServices: boolean = false): Promise<ApiResponse<{ departments: Department[] }>> {
//     try {
//       const params = includeServices ? '?includeServices=true' : '';
//       const response = await fetch(`/api/user/departments${params}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }, // No auth headers for public endpoint
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch departments');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Get departments error:', error);
//       throw error;
//     }
//   }

//   // Services API (public endpoint)
//   static async getDepartmentServices(departmentId: string): Promise<ApiResponse<{ 
//     services: Service[];
//     department: { id: string; code: string; name: string };
//   }>> {
//     try {
//       const response = await fetch(`/api/user/departments/${departmentId}/services`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }, // No auth headers for public endpoint
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch services');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Get department services error:', error);
//       throw error;
//     }
//   }

//   // Agents API (public endpoint)
//   static async getDepartmentAgents(
//     departmentId: string, 
//     position?: string
//   ): Promise<ApiResponse<{ 
//     agents: Agent[];
//     agentsByPosition: Record<string, Agent[]>;
//     department: { id: string; code: string; name: string };
//   }>> {
//     try {
//       const params = position ? `?position=${encodeURIComponent(position)}` : '';
//       const response = await fetch(`/api/user/departments/${departmentId}/agents${params}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }, // No auth headers for public endpoint
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch agents');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Get department agents error:', error);
//       throw error;
//     }
//   }

//   // Appointments API (requires authentication)
//   static async createAppointment(appointmentData: AppointmentCreate): Promise<ApiResponse<{ appointment: Appointment }>> {
//     try {
//       // Check if user is logged in first
//       const token = localStorage.getItem('user_access_token');
//       if (!token) {
//         throw new Error('Please login first to create an appointment');
//       }

//       const formData = new FormData();
      
//       // Add appointment data
//       formData.append('departmentId', appointmentData.departmentId);
//       formData.append('serviceId', appointmentData.serviceId);
//       formData.append('agentId', appointmentData.agentId);
//       formData.append('date', appointmentData.date);
//       formData.append('time', appointmentData.time);
//       if (appointmentData.notes) formData.append('notes', appointmentData.notes);
//       if (appointmentData.priority) formData.append('priority', appointmentData.priority);

//       // Add files
//       if (appointmentData.files) {
//         appointmentData.files.forEach((file, index) => {
//           formData.append('files', file);
//           if (appointmentData.fileNames && appointmentData.fileNames[index]) {
//             formData.append('fileNames', appointmentData.fileNames[index]);
//           }
//         });
//       }

//       console.log('🚀 Creating appointment with token:', token ? 'Present' : 'Missing');

//       const response = await fetch('/api/user/appointments', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           // Don't set Content-Type for FormData
//         },
//         body: formData,
//       });

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ API Error:', errorData);
        
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please login again.');
//         }
        
//         throw new Error(errorData.message || 'Failed to create appointment');
//       }
      
//       const result = await response.json();
//       console.log('✅ Appointment created successfully:', result);
//       return result;

//     } catch (error) {
//       console.error('💥 Create appointment error:', error);
//       throw error;
//     }
//   }

//   static async getAppointments(filters?: {
//     status?: string;
//     limit?: number;
//     page?: number;
//   }): Promise<ApiResponse<{
//     appointments: Appointment[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalCount: number;
//       limit: number;
//     };
//   }>> {
//     try {
//       // Check if user is logged in first
//       const token = localStorage.getItem('user_access_token');
//       if (!token) {
//         throw new Error('Please login first to view appointments');
//       }

//       const params = new URLSearchParams();
//       if (filters?.status) params.append('status', filters.status);
//       if (filters?.limit) params.append('limit', filters.limit.toString());
//       if (filters?.page) params.append('page', filters.page.toString());

//       const response = await fetch(`/api/user/appointments?${params.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please login again.');
//         }
//         throw new Error(errorData.message || 'Failed to fetch appointments');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Get appointments error:', error);
//       throw error;
//     }
//   }

//   // File Upload API (standalone)
//   static async uploadFile(
//     file: File, 
//     folderPath?: string
//   ): Promise<ApiResponse<{
//     url: string;
//     fileName: string;
//     originalName: string;
//     mimeType: string;
//     size: number;
//     folderPath: string | null;
//     uploadedAt: string;
//   }>> {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       if (folderPath) formData.append('folderPath', folderPath);

//       const response = await fetch('/api/file/upload', {
//         method: 'POST',
//         headers: this.getAuthHeadersForFormData(),
//         body: formData,
//       });
      
//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error('Upload file error:', error);
//       throw error;
//     }
//   }

//   // Utility method to check available time slots (mock for now)
//   static async getAvailableTimeSlots(
//     agentId: string, 
//     date: string
//   ): Promise<ApiResponse<{ slots: string[] }>> {
//     try {
//       // This would be a real API call to check agent availability
//       // For now, return mock data similar to the original implementation
//       const baseSlots = this.generateTimeSlots();
//       const availableSlots = this.mockAvailableSlots(agentId, date, baseSlots);
      
//       return {
//         success: true,
//         message: 'Available slots retrieved',
//         data: { slots: Array.from(availableSlots) }
//       };
//     } catch (error) {
//       console.error('Get available slots error:', error);
//       return {
//         success: false,
//         message: 'Failed to get available slots',
//         errors: ['Error fetching availability']
//       };
//     }
//   }

//   // Helper methods for time slot generation (moved from component)
//   private static generateTimeSlots(): string[] {
//     const slots: string[] = [];
//     for (let h = 9; h <= 16; h++) {
//       for (const m of [0, 30]) {
//         const timeSlot = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
//         // Skip lunch break: 12:30 PM to 2:00 PM (12:30 - 14:00)
//         if ((h === 12 && m === 30) || h === 13 || (h === 14 && m === 0)) {
//           continue;
//         }
        
//         slots.push(timeSlot);
//       }
//     }
//     return slots;
//   }

//   private static mockAvailableSlots(agentId: string, date: string, baseSlots: string[]): Set<string> {
//     const blocked = new Set<string>();
//     for (let i = 0; i < baseSlots.length; i++) {
//       const seed = (date.charCodeAt(0) + (agentId?.charCodeAt(0) || 0) + i) % 5;
//       if (seed === 0) blocked.add(baseSlots[i]);
//     }
//     return new Set(baseSlots.filter((s) => !blocked.has(s)));
//   }
// }

// export default UserApiService;