import { NextRequest } from 'next/server';
import AgentAuthService from './agent-auth-service';

// Agent interface for middleware
interface AgentData {
  id: string;
  officerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  officeName: string;
  isActive: boolean;
  assignedDistricts: string[];
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

/**
 * Agent authentication rate limiting
 */
export async function agentAuthRateLimit(request: NextRequest): Promise<{
  success: boolean;
  message: string;
  statusCode: number;
}> {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Max 10 attempts per 15 minutes

  const key = `agent_auth:${ip}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + windowMs });
    return { success: true, message: 'OK', statusCode: 200 };
  }

  if (record.attempts >= maxAttempts) {
    const remainingTime = Math.ceil((record.resetTime - now) / (1000 * 60));
    return {
      success: false,
      message: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
      statusCode: 429
    };
  }

  record.attempts += 1;
  return { success: true, message: 'OK', statusCode: 200 };
}

/**
 * Agent authentication middleware
 */
export async function authenticateAgent(request: NextRequest): Promise<{
  success: boolean;
  agent?: AgentData;
  message: string;
  statusCode: number;
}> {
  try {
    // Get token from cookies
    const token = request.cookies.get('agent_access_token')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Access token not found',
        statusCode: 401
      };
    }

    // Verify token
    const decoded = AgentAuthService.verifyAccessToken(token);
    if (!decoded || !decoded.agentId) {
      return {
        success: false,
        message: 'Invalid or expired access token',
        statusCode: 401
      };
    }

    // Get agent profile
    const result = await AgentAuthService.getAgentProfile(decoded.agentId);
    if (!result.success || !result.agent) {
      return {
        success: false,
        message: 'Agent not found or inactive',
        statusCode: 401
      };
    }

    return {
      success: true,
      agent: result.agent,
      message: 'Authentication successful',
      statusCode: 200
    };

  } catch (error) {
    console.error('Agent authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed',
      statusCode: 500
    };
  }
}

/**
 * Agent authorization middleware for specific departments
 */
export async function authorizeAgentDepartment(
  request: NextRequest,
  allowedDepartments: string[]
): Promise<{
  success: boolean;
  agent?: AgentData;
  message: string;
  statusCode: number;
}> {
  const authResult = await authenticateAgent(request);
  
  if (!authResult.success || !authResult.agent) {
    return authResult;
  }

  const agent = authResult.agent;
  if (!allowedDepartments.includes(agent.department)) {
    return {
      success: false,
      message: 'Insufficient permissions for this department',
      statusCode: 403
    };
  }

  return authResult;
}

/**
 * Agent authorization middleware for specific districts
 */
export async function authorizeAgentDistrict(
  request: NextRequest,
  requiredDistrict: string
): Promise<{
  success: boolean;
  agent?: AgentData;
  message: string;
  statusCode: number;
}> {
  const authResult = await authenticateAgent(request);
  
  if (!authResult.success || !authResult.agent) {
    return authResult;
  }

  const agent = authResult.agent;
  if (!agent.assignedDistricts.includes(requiredDistrict)) {
    return {
      success: false,
      message: 'Insufficient permissions for this district',
      statusCode: 403
    };
  }

  return authResult;
}

/**
 * Simplified agent verification for API routes
 */
export async function verifyAgentAuth(request: NextRequest): Promise<{
  isValid: boolean;
  agent?: {
    _id: string;
    officerId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    department: string;
    officeName: string;
    isActive: boolean;
    assignedDistricts: string[];
  };
  message?: string;
}> {
  const authResult = await authenticateAgent(request);
  
  if (!authResult.success || !authResult.agent) {
    return {
      isValid: false,
      message: authResult.message
    };
  }

  return {
    isValid: true,
    agent: {
      _id: authResult.agent.id,
      ...authResult.agent
    }
  };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every hour
setInterval(cleanupRateLimit, 60 * 60 * 1000);
