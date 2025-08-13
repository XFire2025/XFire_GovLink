import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/adminSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const tokenFromCookie = request.cookies.get('admin_token')?.value;
    
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Access token not found',
          errors: ['No access token provided']
        },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token',
          errors: ['Token verification failed']
        },
        { status: 401 }
      );
    }

    if (!decoded.userId || decoded.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid token payload',
          errors: ['Token does not contain valid admin credentials']
        },
        { status: 401 }
      );
    }

    // Find admin
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admin not found',
          errors: ['Admin account not found']
        },
        { status: 404 }
      );
    }

    // Check account status
    if (admin.accountStatus !== 'ACTIVE') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account not active',
          errors: [`Account is ${admin.accountStatus.toLowerCase()}`]
        },
        { status: 403 }
      );
    }

    // Return admin profile
    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin profile retrieved successfully',
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          accountStatus: admin.accountStatus,
          lastLoginAt: admin.lastLoginAt,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin profile API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Failed to retrieve admin profile']
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
