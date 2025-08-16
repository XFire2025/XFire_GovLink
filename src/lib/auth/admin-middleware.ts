import { NextRequest } from "next/server";
import {
  verifyAccessToken,
  extractTokenFromHeader,
  JWTPayload,
} from "./user-jwt";
import Admin from "../models/adminSchema";
import connectDB from "../db";

// Extended request interface with admin data
export interface AuthenticatedAdminRequest extends NextRequest {
  admin?: JWTPayload & {
    id: string;
  };
}

// Middleware response type for admin
export type AdminMiddlewareResponse = {
  success: boolean;
  message: string;
  admin?: JWTPayload & { id: string };
  statusCode: number;
};

// Authentication middleware for admin API routes
export const authenticateAdmin = async (
  request: NextRequest
): Promise<AdminMiddlewareResponse> => {
  try {
    // Extract token from Authorization header or cookies
    const authHeader = request.headers.get("Authorization");
    let token = extractTokenFromHeader(authHeader);

    // If no token in header, try cookies
    if (!token) {
      token = request.cookies.get("admin_access_token")?.value || null;
    }

    if (!token) {
      return {
        success: false,
        message: "Access token is required",
        statusCode: 401,
      };
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if this is an admin token
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return {
        success: false,
        message: "Admin access required",
        statusCode: 403,
      };
    }

    // Check if admin still exists and is active
    await connectDB();
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return {
        success: false,
        message: "Admin not found",
        statusCode: 401,
      };
    }

    // Check account status
    if (admin.accountStatus === "SUSPENDED") {
      return {
        success: false,
        message: "Admin account is suspended",
        statusCode: 403,
      };
    }

    if (admin.accountStatus === "DEACTIVATED") {
      return {
        success: false,
        message: "Admin account is deactivated",
        statusCode: 403,
      };
    }

    // Add admin data to request
    const authenticatedAdmin = {
      ...decoded,
      id: decoded.userId,
    };

    return {
      success: true,
      message: "Admin authentication successful",
      admin: authenticatedAdmin,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Admin authentication failed",
      statusCode: 401,
    };
  }
};

// Helper function to create middleware response
export const createAdminMiddlewareResponse = (
  result: AdminMiddlewareResponse
) => {
  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    message: result.message,
    status: result.statusCode,
  };
};

// Helper function to get admin from request (after authentication)
export const getAdminFromRequest = async (
  request: NextRequest
): Promise<JWTPayload | null> => {
  try {
    const authResult = await authenticateAdmin(request);
    return authResult.success ? authResult.admin! : null;
  } catch {
    return null;
  }
};

// Rate limiting for admin login (more strict)
export const adminAuthRateLimit = async (
  request: NextRequest
): Promise<AdminMiddlewareResponse> => {
  // Get IP address from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  // More strict rate limiting for admin (3 attempts per 15 minutes)
  const maxRequests = 3;
  const windowMs = 15 * 60 * 1000; // 15 minutes

  const now = Date.now();
  const key = `admin_auth_${ip}`;

  // Simple in-memory rate limiting (in production, use Redis)
  if (!global.adminRateLimitMap) {
    global.adminRateLimitMap = new Map();
  }

  const rateLimitData = global.adminRateLimitMap.get(key) || {
    count: 0,
    lastReset: now,
  };

  // Reset if window has passed
  if (now - rateLimitData.lastReset > windowMs) {
    rateLimitData.count = 0;
    rateLimitData.lastReset = now;
  }

  // Check if limit exceeded
  if (rateLimitData.count >= maxRequests) {
    const resetTime = Math.ceil(
      (windowMs - (now - rateLimitData.lastReset)) / 1000 / 60
    );
    return {
      success: false,
      message: `Too many admin login attempts. Try again in ${resetTime} minutes.`,
      statusCode: 429,
    };
  }

  // Increment counter
  rateLimitData.count++;
  global.adminRateLimitMap.set(key, rateLimitData);

  return {
    success: true,
    message: "Rate limit check passed",
    statusCode: 200,
  };
};

// Verify admin authentication for API routes (similar to agent middleware pattern)
export const verifyAdminAuth = async (request: NextRequest) => {
  const authResult = await authenticateAdmin(request);
  
  if (!authResult.success) {
    return {
      isValid: false,
      admin: null,
      error: authResult.message
    };
  }

  // Fetch full admin data
  await connectDB();
  const admin = await Admin.findById(authResult.admin!.userId);
  
  return {
    isValid: true,
    admin,
    error: null
  };
};

// Declare global type for rate limiting
declare global {
  var adminRateLimitMap: Map<string, { count: number; lastReset: number }>;
}
