import { NextRequest } from 'next/server';
import DepartmentAuthService from './department-auth-service';

export interface DepartmentMiddlewareResult {
  success: boolean;
  message: string;
  statusCode: number;
  department?: {
    id: string;
    departmentId: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate department requests
 */
export async function departmentAuthMiddleware(request: NextRequest): Promise<DepartmentMiddlewareResult> {
  try {
    // Get token from Authorization header or cookies
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('department_access_token')?.value;
    }

    if (!token) {
      return {
        success: false,
        message: 'Access token is required',
        statusCode: 401
      };
    }

    // Verify token
    const verification = DepartmentAuthService.verifyDepartmentToken(token);
    
    if (!verification.valid) {
      return {
        success: false,
        message: verification.error || 'Invalid token',
        statusCode: 401
      };
    }

    // Check if it's a department token
    if (!verification.decoded || verification.decoded.role !== 'department') {
      return {
        success: false,
        message: 'Invalid access role',
        statusCode: 403
      };
    }

    return {
      success: true,
      message: 'Authentication successful',
      statusCode: 200,
      department: {
        id: verification.decoded.departmentId,
        departmentId: verification.decoded.departmentCode,
        email: verification.decoded.email,
        role: verification.decoded.role
      }
    };

  } catch (error) {
    console.error('Department auth middleware error:', error);
    return {
      success: false,
      message: 'Authentication failed',
      statusCode: 500
    };
  }
}

/**
 * Rate limiting for department authentication
 */
const departmentAuthAttempts = new Map<string, { count: number; resetTime: number }>();

export async function departmentAuthRateLimit(request: NextRequest): Promise<DepartmentMiddlewareResult> {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Max 10 attempts per window

  // Clean expired entries
  for (const [key, value] of departmentAuthAttempts.entries()) {
    if (now > value.resetTime) {
      departmentAuthAttempts.delete(key);
    }
  }

  const current = departmentAuthAttempts.get(ip);

  if (!current) {
    departmentAuthAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return {
      success: true,
      message: 'Rate limit check passed',
      statusCode: 200
    };
  }

  if (current.count >= maxAttempts) {
    const resetInMinutes = Math.ceil((current.resetTime - now) / (1000 * 60));
    return {
      success: false,
      message: `Too many authentication attempts. Try again in ${resetInMinutes} minutes`,
      statusCode: 429
    };
  }

  current.count += 1;
  departmentAuthAttempts.set(ip, current);

  return {
    success: true,
    message: 'Rate limit check passed',
    statusCode: 200
  };
}