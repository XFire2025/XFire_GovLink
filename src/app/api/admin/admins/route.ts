import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin, { AdminRole, AccountStatus } from "@/lib/models/adminSchema";
import { authenticateAdmin } from "@/lib/auth/admin-middleware";
import bcrypt from "bcryptjs";

// GET: Get all admins (Super Admin only)
export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    // Check if the authenticated admin is a super admin
    const admin = await Admin.findById(authResult.admin!.userId);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      );
    }

    // Get all admins
    const admins = await Admin.find({})
      .select(
        "fullName email role accountStatus lastLoginAt createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      admins: admins.map((admin) => ({
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        accountStatus: admin.accountStatus,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create new admin (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    await connectDB();

    // Check if the authenticated admin is a super admin
    const admin = await Admin.findById(authResult.admin!.userId);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      );
    }

    const { fullName, email, password, role } = await request.json();

    // Basic validation
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!Object.values(AdminRole).includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const newAdmin = new Admin({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      accountStatus: AccountStatus.ACTIVE,
    });

    await newAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          role: newAdmin.role,
          accountStatus: newAdmin.accountStatus,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
