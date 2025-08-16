// src/lib/utils/bookingHelper.ts

interface Department {
  id: string;
  departmentId: string;
  name: string;
  shortName: string;
  description: string;
  services?: Service[];
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  processingTime?: string;
  fee?: number;
  requirements?: string[];
  departmentId?: string;
  departmentName?: string;
}

interface BookingSuggestion {
  type: 'department' | 'service';
  id: string;
  name: string;
  description?: string;
  departmentId?: string;
  departmentName?: string;
  category?: string;
  fee?: number;
  relevanceScore: number;
}

export type { BookingSuggestion };

/**
 * Fetches all departments with their services for booking suggestions
 */
export async function fetchBookingData(baseUrl: string = ''): Promise<{ departments: Department[]; services: Service[] }> {
  try {
    const response = await fetch(`${baseUrl}/api/user/departments?includeServices=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: This will work for server-side calls, client-side calls need different auth handling
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid response format');
    }

    const departments: Department[] = data.data;
    
    // Flatten all services from all departments
    const services: Service[] = departments.flatMap(dept => 
      (dept.services || []).map(service => ({
        ...service,
        departmentId: dept.departmentId,
        departmentName: dept.name
      }))
    );

    return { departments, services };
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return { departments: [], services: [] };
  }
}

/**
 * Analyzes user query and suggests relevant departments and services
 */
export function suggestBookingOptions(
  query: string, 
  departments: Department[], 
  services: Service[]
): BookingSuggestion[] {
  const normalizedQuery = query.toLowerCase();
  const suggestions: BookingSuggestion[] = [];

  // Keywords mapping for better matching
  const serviceKeywords: Record<string, string[]> = {
    passport: ['passport', 'travel', 'immigration', 'visa', 'abroad', 'international'],
    license: ['license', 'permit', 'driving', 'vehicle', 'motorcycle', 'car'],
    certificate: ['certificate', 'birth', 'death', 'marriage', 'divorce', 'citizenship'],
    registration: ['register', 'registration', 'business', 'company', 'organization'],
    tax: ['tax', 'income', 'vat', 'customs', 'duty', 'revenue'],
    education: ['education', 'school', 'university', 'degree', 'scholarship', 'student'],
    health: ['health', 'medical', 'hospital', 'medicine', 'doctor', 'treatment'],
    property: ['property', 'land', 'house', 'building', 'real estate', 'title'],
    insurance: ['insurance', 'social security', 'pension', 'retirement', 'benefits'],
    employment: ['employment', 'job', 'work', 'labor', 'salary', 'employee']
  };

  // Department keywords mapping
  const departmentKeywords: Record<string, string[]> = {
    immigration: ['immigration', 'passport', 'visa', 'travel', 'foreign'],
    transport: ['transport', 'vehicle', 'driving', 'license', 'road'],
    registrar: ['registrar', 'birth', 'death', 'marriage', 'certificate'],
    revenue: ['revenue', 'tax', 'customs', 'duty', 'vat'],
    education: ['education', 'ministry of education', 'school', 'university'],
    health: ['health', 'ministry of health', 'medical', 'hospital'],
    lands: ['lands', 'property', 'title', 'survey', 'real estate']
  };

  // Score services based on keyword matching
  services.forEach(service => {
    let relevanceScore = 0;
    
    // Direct name matching
    if (service.name.toLowerCase().includes(normalizedQuery)) {
      relevanceScore += 10;
    }
    
    // Description matching
    if (service.description && service.description.toLowerCase().includes(normalizedQuery)) {
      relevanceScore += 7;
    }
    
    // Category matching
    if (service.category && service.category.toLowerCase().includes(normalizedQuery)) {
      relevanceScore += 5;
    }
    
    // Keyword matching
    Object.entries(serviceKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (normalizedQuery.includes(keyword)) {
          if (service.name.toLowerCase().includes(category)) {
            relevanceScore += 8;
          } else if (service.description?.toLowerCase().includes(category)) {
            relevanceScore += 6;
          } else if (service.category?.toLowerCase().includes(category)) {
            relevanceScore += 4;
          }
        }
      });
    });
    
    if (relevanceScore > 0) {
      suggestions.push({
        type: 'service',
        id: service.id,
        name: service.name,
        description: service.description,
        departmentId: service.departmentId,
        departmentName: service.departmentName,
        category: service.category,
        fee: service.fee,
        relevanceScore
      });
    }
  });

  // Score departments based on keyword matching
  departments.forEach(dept => {
    let relevanceScore = 0;
    
    // Direct name matching
    if (dept.name.toLowerCase().includes(normalizedQuery) || 
        dept.shortName.toLowerCase().includes(normalizedQuery)) {
      relevanceScore += 8;
    }
    
    // Description matching
    if (dept.description && dept.description.toLowerCase().includes(normalizedQuery)) {
      relevanceScore += 6;
    }
    
    // Keyword matching for departments
    Object.entries(departmentKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (normalizedQuery.includes(keyword)) {
          if (dept.name.toLowerCase().includes(category) || 
              dept.shortName.toLowerCase().includes(category)) {
            relevanceScore += 7;
          } else if (dept.description?.toLowerCase().includes(category)) {
            relevanceScore += 5;
          }
        }
      });
    });
    
    if (relevanceScore > 0) {
      suggestions.push({
        type: 'department',
        id: dept.departmentId,
        name: dept.name,
        description: dept.description,
        relevanceScore
      });
    }
  });

  // Sort by relevance score and return top 5
  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}

/**
 * Formats booking suggestions into a user-friendly message
 */
export function formatBookingSuggestions(suggestions: BookingSuggestion[]): string {
  if (suggestions.length === 0) {
    return `🔍 **I found your booking request!**

I'd be happy to help you book an appointment. However, I need a bit more information about what specific service you're looking for. 

📋 **Available Services Include:**
• Passport & Immigration Services
• Driving License & Vehicle Registration  
• Birth/Marriage/Death Certificates
• Business Registration
• Tax & Revenue Services
• Educational Certificates
• Property & Land Services

**Could you please tell me more specifically what you need assistance with?** For example:
• "I need to renew my passport"
• "I want to register a new business"
• "I need a birth certificate"

This will help me suggest the most relevant department and services for your appointment! 🎯`;
  }

  let message = `🎯 **Perfect! I found some great options for your appointment:**\n\n`;
  
  // Group suggestions by type
  const serviceSuggestions = suggestions.filter(s => s.type === 'service');
  const departmentSuggestions = suggestions.filter(s => s.type === 'department');
  
  if (serviceSuggestions.length > 0) {
    message += `📋 **Recommended Services:**\n`;
    serviceSuggestions.forEach((suggestion, index) => {
      message += `${index + 1}. **${suggestion.name}**\n`;
      if (suggestion.departmentName) {
        message += `   📍 Department: ${suggestion.departmentName}\n`;
      }
      if (suggestion.description) {
        message += `   📝 ${suggestion.description}\n`;
      }
      if (suggestion.fee && suggestion.fee > 0) {
        message += `   💰 Fee: LKR ${suggestion.fee}\n`;
      }
      message += `\n`;
    });
  }
  
  if (departmentSuggestions.length > 0) {
    message += `🏛️ **Relevant Departments:**\n`;
    departmentSuggestions.forEach((suggestion, index) => {
      message += `${index + 1}. **${suggestion.name}**\n`;
      if (suggestion.description) {
        message += `   📝 ${suggestion.description}\n`;
      }
      message += `\n`;
    });
  }
  
  message += `✨ **Ready to book?** Just tell me which option you'd like, and I'll redirect you to the booking form with everything pre-filled!\n\n`;
  message += `Example: "I want option 1" or "Book ${serviceSuggestions[0]?.name || departmentSuggestions[0]?.name}"\n\n`;
  message += `[🔗 **Or click here to see all booking options**](/user/booking/new)`;
  
  return message;
}

/**
 * Generates booking URL with pre-filled parameters
 */
export function generateBookingUrl(departmentId?: string, serviceId?: string): string {
  const params = new URLSearchParams();
  
  if (departmentId) {
    params.set('department', departmentId);
  }
  
  if (serviceId) {
    params.set('service', serviceId);
  }
  
  const queryString = params.toString();
  return `/user/booking/new${queryString ? `?${queryString}` : ''}`;
}

/**
 * Parses user selection from booking suggestions
 */
export function parseBookingSelection(
  userMessage: string, 
  previousSuggestions: BookingSuggestion[]
): { departmentId?: string; serviceId?: string } | null {
  const normalizedMessage = userMessage.toLowerCase();
  
  // Check for option number selection (e.g., "option 1", "1", "first one")
  const optionMatch = normalizedMessage.match(/(?:option\s*)?(\d+)|(?:first|second|third|fourth|fifth)/);
  if (optionMatch) {
    let optionIndex = 0;
    
    if (optionMatch[1]) {
      optionIndex = parseInt(optionMatch[1]) - 1;
    } else {
      const wordToNumber: Record<string, number> = {
        'first': 0, 'second': 1, 'third': 2, 'fourth': 3, 'fifth': 4
      };
      const word = optionMatch[0];
      optionIndex = wordToNumber[word] ?? 0;
    }
    
    if (optionIndex >= 0 && optionIndex < previousSuggestions.length) {
      const selected = previousSuggestions[optionIndex];
      return {
        departmentId: selected.departmentId || (selected.type === 'department' ? selected.id : undefined),
        serviceId: selected.type === 'service' ? selected.id : undefined
      };
    }
  }
  
  // Check for direct name matching
  for (const suggestion of previousSuggestions) {
    if (normalizedMessage.includes(suggestion.name.toLowerCase())) {
      return {
        departmentId: suggestion.departmentId || (suggestion.type === 'department' ? suggestion.id : undefined),
        serviceId: suggestion.type === 'service' ? suggestion.id : undefined
      };
    }
  }
  
  return null;
}
