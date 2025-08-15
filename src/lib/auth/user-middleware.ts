import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './user-jwt';
import User from '../models/userSchema';
import connectDB from '../db';

// Extended request interface with user data
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload & {
    id: string;
  };
}

// Middleware response type
export type MiddlewareResponse = {
  success: boolean;
  message: string;
  user?: JWTPayload & { id: string };
  statusCode: number;
};

// Authentication middleware for API routes
export const authenticate = async (request: NextRequest): Promise<MiddlewareResponse> => {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        success: false,
        message: 'Access token is required',
        statusCode: 401
      };
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists and is active
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 401
      };
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return {
        success: false,
        message: 'Account is suspended',
        statusCode: 403
      };
    }

    if (user.accountStatus === 'deactivated') {
      return {
        success: false,
        message: 'Account is deactivated',
        statusCode: 403
      };
    }

    // Add user data to request
    const authenticatedUser = {
      ...decoded,
      id: decoded.userId
    };

    return {
      success: true,
      message: 'Authentication successful',
      user: authenticatedUser,
      statusCode: 200
    };

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
      statusCode: 401
    };
  }
};

// Role-based authorization middleware
export const authorize = (allowedRoles: string[]) => {
  return async (request: NextRequest): Promise<MiddlewareResponse> => {
    // First authenticate
    const authResult = await authenticate(request);
    
    if (!authResult.success) {
      return authResult;
    }

    // Check role authorization
    if (!authResult.user || !allowedRoles.includes(authResult.user.role)) {
      return {
        success: false,
        message: 'Insufficient permissions',
        statusCode: 403
      };
    }

    return authResult;
  };
};

// Middleware for citizens only
export const authenticateCitizen = authorize(['citizen']);

// Middleware for agents only
export const authenticateAgent = authorize(['agent']);

// Middleware for admins only
export const authenticateAdmin = authorize(['admin']);

// Middleware for agents and admins
export const authenticateStaff = authorize(['agent', 'admin']);

// Middleware for all authenticated users
export const authenticateAny = authenticate;

// Email verification middleware
export const requireEmailVerification = async (request: NextRequest): Promise<MiddlewareResponse> => {
  const authResult = await authenticate(request);
  
  if (!authResult.success) {
    return authResult;
  }

  // Check if email is verified
  await connectDB();
  const user = await User.findById(authResult.user!.userId);
  
  if (!user?.emailVerified) {
    return {
      success: false,
      message: 'Email verification required',
      statusCode: 403
    };
  }

  return authResult;
};

// Profile completion middleware
export const requireProfileCompletion = async (request: NextRequest): Promise<MiddlewareResponse> => {
  const authResult = await authenticate(request);
  
  if (!authResult.success) {
    return authResult;
  }

  // Check if profile is completed
  await connectDB();
  const user = await User.findById(authResult.user!.userId);
  
  if (user?.profileStatus === 'incomplete') {
    return {
      success: false,
      message: 'Profile completion required',
      statusCode: 403
    };
  }

  return authResult;
};

// Helper function to create middleware response
export const createMiddlewareResponse = (result: MiddlewareResponse): NextResponse => {
  if (result.success) {
    return NextResponse.next();
  }

  return NextResponse.json(
    { 
      success: false, 
      message: result.message 
    },
    { status: result.statusCode }
  );
};

// Helper function to get user from request (after authentication)
export const getUserFromRequest = async (request: NextRequest): Promise<JWTPayload | null> => {
  try {
    const authResult = await authenticate(request);
    return authResult.success ? authResult.user! : null;
  } catch {
    return null;
  }
};

// Rate limiting middleware
export const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (request: NextRequest): Promise<MiddlewareResponse> => {
    // Extract IP address from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit data for this IP
    let rateLimitData = rateLimitMap.get(ip);
    
    if (!rateLimitData || rateLimitData.lastReset < windowStart) {
      rateLimitData = { count: 0, lastReset: now };
    }

    rateLimitData.count++;
    rateLimitMap.set(ip, rateLimitData);

    if (rateLimitData.count > maxRequests) {
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
        statusCode: 429
      };
    }

    return {
      success: true,
      message: 'Rate limit check passed',
      statusCode: 200
    };
  };
};

// Common rate limits
export const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes for auth
export const apiRateLimit = rateLimit(100, 15 * 60 * 1000); // 100 requests per 15 minutes for API
export const strictRateLimit = rateLimit(3, 60 * 60 * 1000); // 3 requests per hour for sensitive operations
