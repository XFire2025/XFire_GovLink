// src/app/api/ragbot/booking-suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/lib/models/departmentSchema';

interface ServiceSchema {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  processingTime?: string;
  fee?: number;
  requirements?: string[];
}
interface DepartmentData {
  id: string;
  departmentId: string;
  name: string;
  shortName: string;
  description: string;
  services?: ServiceData[];
}

interface ServiceData {
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

/**
 * Server-side booking suggestions for the RAG bot
 */
export async function POST(request: NextRequest) {
  try {
    // Add proper error handling for JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('❌ Invalid JSON in request body:', jsonError);
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          suggestions: [],
          details: jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error'
        },
        { status: 400 }
      );
    }

    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { 
          error: 'Query is required',
          suggestions: []
        },
        { status: 400 }
      );
    }

    console.log('🔍 Booking suggestions API called with query:', query);

    await connectDB();

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

    console.log('🏛️ Raw departments from DB:', departments.length);
    console.log('📊 First department services:', departments[0]?.services?.length || 0);

    // Transform data to match booking helper format
    const departmentData: DepartmentData[] = departments.map(dept => ({
      id: dept._id ? String(dept._id) : '',
      departmentId: dept.departmentId || '',
      name: dept.name || '',
      shortName: dept.shortName || '',
      description: dept.description || '',
      services: (dept.services || [])
        .filter((service: ServiceSchema) => service.isActive)
        .map((service: ServiceSchema) => ({
          id: service.id || '',
          name: service.name || '',
          description: service.description || '',
          category: service.category || '',
          processingTime: service.processingTime || '',
          fee: service.fee || 0,
          requirements: service.requirements || [],
          departmentId: dept.departmentId || '',
          departmentName: dept.name || ''
        }))
    }));

    // Flatten all services
    const services: ServiceData[] = departmentData.flatMap(dept => dept.services || []);

    // Generate suggestions using server-side logic
    const suggestions = generateBookingSuggestions(query, departmentData, services);

    console.log('📊 Generated suggestions:', suggestions.length);
    console.log('🎯 Suggestions:', suggestions);
    console.log('🏛️ Departments found:', departmentData.length);
    console.log('📋 Services found:', services.length);

    return NextResponse.json({
      success: true,
      suggestions,
      departments: departmentData,
      services
    });

  } catch (error) {
    console.error('Error generating booking suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * Server-side suggestion logic (similar to client-side but optimized for server)
 */
function generateBookingSuggestions(
  query: string, 
  departments: DepartmentData[], 
  services: ServiceData[]
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
