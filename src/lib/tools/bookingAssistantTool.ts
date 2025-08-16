// src/lib/tools/bookingAssistantTool.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

interface Service {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Department {
  _id: string;
  name: string;
  services: Service[];
  isActive: boolean;
}

interface ServiceData {
  id: string;
  name: string;
  description?: string;
  departmentId: string;
  departmentName: string;
}

interface DepartmentData {
  id: string;
  departmentId: string;
  name: string;
  shortName: string;
  description: string;
  services: ServiceData[];
}

interface DepartmentListItem {
  id: string;
  departmentId: string;
  name: string;
  shortName: string;
  description: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

interface DepartmentWithServices {
  _id: string;
  name: string;
  services?: Array<{
    _id?: string;
    id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
  }>;
}

interface BookingSuggestion {
  departmentId: string;
  departmentName: string;
  serviceId?: string;
  serviceName?: string;
  confidence: number;
  description?: string;
}

interface BookingToolResult {
  success: boolean;
  action: 'list_options' | 'generate_url' | 'suggest_services';
  departments?: DepartmentListItem[];
  services?: Service[];
  suggestions?: BookingSuggestion[];
  bookingUrl?: string;
  message: string;
}

export class BookingAssistantTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: "booking_assistant",
      description: `Assists users with booking appointments by providing department and service options, 
      generating smart suggestions based on user queries, and creating pre-filled booking URLs.
      Use this tool when users want to book appointments, schedule meetings, or reserve time slots.`,
      schema: z.object({
        action: z.enum(['list_departments', 'list_services', 'suggest_from_query', 'generate_booking_url'])
          .describe("The action to perform"),
        departmentId: z.string().optional()
          .describe("Department ID when listing services or generating URL"),
        serviceId: z.string().optional()
          .describe("Service ID when generating booking URL"),
        query: z.string().optional()
          .describe("User's booking query for generating suggestions"),
        userMessage: z.string().optional()
          .describe("The user's original message to better understand intent")
      }),
      func: async ({ action, departmentId, serviceId, query, userMessage }) => {
        try {
          switch (action) {
            case 'list_departments':
              return await this.listDepartments();
              
            case 'list_services':
              if (!departmentId) {
                return this.createErrorResult("Department ID is required to list services");
              }
              return await this.listServices(departmentId);
              
            case 'suggest_from_query':
              if (!query && !userMessage) {
                return this.createErrorResult("Query or user message is required for suggestions");
              }
              return await this.generateSuggestions(query || userMessage || '');
              
            case 'generate_booking_url':
              return this.generateBookingUrl(departmentId, serviceId);
              
            default:
              return this.createErrorResult("Invalid action specified");
          }
        } catch (error) {
          console.error("Booking assistant tool error:", error);
          return this.createErrorResult(`Failed to process booking request: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    });
  }

  private async listDepartments(): Promise<string> {
    try {
      await connectDB();
      
      // Query departments directly from database
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
          requiresAppointment: 1
        }
      ).lean();

      console.log('🏛️ Booking assistant: Found departments:', departments.length);

      const transformedDepartments = departments.map(dept => ({
        id: dept._id ? String(dept._id) : '',
        departmentId: dept.departmentId || '',
        name: dept.name || '',
        shortName: dept.shortName || '',
        description: dept.description || '',
        email: dept.email || '',
        phoneNumber: dept.phoneNumber || '',
        isActive: true
      }));

      const result: BookingToolResult = {
        success: true,
        action: 'list_options',
        departments: transformedDepartments,
        message: `Found ${transformedDepartments.length} available departments for booking. Present these options to the user and ask them to choose.`
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error('❌ Booking assistant: Error fetching departments:', error);
      return this.createErrorResult(`Error fetching departments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async listServices(departmentId: string): Promise<string> {
    try {
      await connectDB();
      
      // Query department with services - handle both ObjectId and departmentId
      const department = await Department.findOne({
        $or: [
          { _id: departmentId.match(/^[0-9a-fA-F]{24}$/) ? departmentId : null },
          { departmentId: departmentId }
        ]
      }, {
        _id: 1,
        name: 1,
        services: 1
      }).lean() as DepartmentWithServices | null;

      if (!department) {
        return this.createErrorResult("Department not found");
      }

      const services = (department.services || [])
        .filter((service: { isActive?: boolean }) => service.isActive)
        .map((service: { id?: string; _id?: string; name?: string; description?: string }) => ({
          _id: service.id || service._id || '',
          name: service.name || '',
          description: service.description || '',
          isActive: true
        }));

      console.log('📋 Booking assistant: Found services:', services.length);

      const result: BookingToolResult = {
        success: true,
        action: 'suggest_services',
        services: services,
        message: `Found ${services.length} available services in this department. Present these options to the user.`
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error('❌ Booking assistant: Error fetching services:', error);
      return this.createErrorResult(`Error fetching services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateSuggestions(query: string): Promise<string> {
    try {
      await connectDB();
      
      // Use the existing booking suggestions API logic
      // Fetch departments with services
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
          services: 1
        }
      ).lean();

      console.log('🔍 Booking assistant: Generating suggestions for query:', query);
      console.log('🏛️ Booking assistant: Found departments for suggestions:', departments.length);

      // Transform departments data
      const departmentData = departments.map(dept => ({
        id: dept._id ? String(dept._id) : '',
        departmentId: dept.departmentId || '',
        name: dept.name || '',
        shortName: dept.shortName || '',
        description: dept.description || '',
        services: (dept.services || [])
          .filter((service: { isActive?: boolean }) => service.isActive)
          .map((service: { id?: string; _id?: string; name?: string; description?: string }) => ({
            id: service.id || service._id || '',
            name: service.name || '',
            description: service.description || '',
            departmentId: dept.departmentId || '',
            departmentName: dept.name || ''
          }))
      }));

      // Generate suggestions using simple keyword matching
      const suggestions = this.generateBookingSuggestionsLogic(query, departmentData);

      console.log('🎯 Booking assistant: Generated suggestions:', suggestions.length);

      const result: BookingToolResult = {
        success: true,
        action: 'list_options',
        suggestions: suggestions as BookingSuggestion[],
        message: suggestions.length > 0 
          ? `Based on your query "${query}", I found ${suggestions.length} relevant booking options. Let me present them to you.`
          : `I couldn't find specific matches for "${query}". Let me show you all available departments so you can choose.`
      };

      return JSON.stringify(result);
    } catch (error) {
      console.error('❌ Booking assistant: Error generating suggestions:', error);
      return this.createErrorResult(`Error generating suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateBookingUrl(departmentId?: string, serviceId?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:3002`;
    const params = new URLSearchParams();
    
    if (departmentId) params.append('department', departmentId);
    if (serviceId) params.append('service', serviceId);
    
    const bookingUrl = `${baseUrl}/user/booking/new${params.toString() ? `?${params.toString()}` : ''}`;
    
    const result: BookingToolResult = {
      success: true,
      action: 'generate_url',
      bookingUrl,
      message: `Perfect! I'll redirect you to the booking form with your selections pre-filled. Click the link below to proceed with your appointment booking.`
    };

    return JSON.stringify(result);
  }

  private generateBookingSuggestionsLogic(query: string, departments: DepartmentData[]): BookingSuggestion[] {
    const normalizedQuery = query.toLowerCase();
    const suggestions: BookingSuggestion[] = [];

    // Simple keyword matching for common services
    const keywordMap: Record<string, string[]> = {
      passport: ['passport', 'travel', 'immigration', 'visa'],
      license: ['license', 'permit', 'driving', 'vehicle'],
      certificate: ['certificate', 'birth', 'death', 'marriage'],
      registration: ['register', 'business', 'company'],
      tax: ['tax', 'income', 'revenue']
    };

    // Check each department and its services
    departments.forEach(dept => {
      dept.services?.forEach((service: ServiceData) => {
        let score = 0;
        
        // Check service name match
        if (service.name && service.name.toLowerCase().includes(normalizedQuery)) {
          score += 0.8;
        }
        
        // Check keyword matches
        Object.entries(keywordMap).forEach(([, keywords]) => {
          keywords.forEach(keyword => {
            if (normalizedQuery.includes(keyword) && 
                (service.name?.toLowerCase().includes(keyword) || 
                 dept.name?.toLowerCase().includes(keyword))) {
              score += 0.6;
            }
          });
        });

        if (score > 0.5) {
          suggestions.push({
            departmentId: dept.id,
            departmentName: dept.name,
            serviceId: service.id,
            serviceName: service.name,
            confidence: score,
            description: service.description || `${service.name} service from ${dept.name}`
          });
        }
      });
    });

    // Sort by confidence and return top 5
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private createErrorResult(message: string): string {
    const result: BookingToolResult = {
      success: false,
      action: 'list_options',
      message
    };
    return JSON.stringify(result);
  }
}

// Export the factory function
export const createBookingAssistantTool = () => new BookingAssistantTool();
