import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin, { AdminRole, AccountStatus } from "@/lib/models/adminSchema";
import { authenticateAdmin } from "@/lib/auth/admin-middleware";
import bcrypt from "bcryptjs";

type Params = { id: string };

interface AdminUpdatePayload {
  fullName?: string;
  email?: string;
  role?: AdminRole;
  accountStatus?: AccountStatus;
  password?: string;
}

// GET: Get specific admin (Super Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    const resolvedParams = await params;
    await connectDB();

    // Check if the authenticated admin is a super admin
    const admin = await Admin.findById(authResult.admin!.userId);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      );
    }

    // Get specific admin
    const targetAdmin = await Admin.findById(resolvedParams.id).select(
      "fullName email role accountStatus lastLoginAt createdAt updatedAt"
    );

    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: targetAdmin._id,
        fullName: targetAdmin.fullName,
        email: targetAdmin.email,
        role: targetAdmin.role,
        accountStatus: targetAdmin.accountStatus,
        lastLoginAt: targetAdmin.lastLoginAt,
        createdAt: targetAdmin.createdAt,
        updatedAt: targetAdmin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update admin (Super Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    const resolvedParams = await params;
    await connectDB();

    // Check if the authenticated admin is a super admin
    const admin = await Admin.findById(authResult.admin!.userId);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      );
    }

    const { fullName, email, role, accountStatus, password } =
      await request.json();

    // Find the admin to update
    const targetAdmin = await Admin.findById(resolvedParams.id);
    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Prevent modifying the current super admin's role to regular admin if they're the only super admin
    if (
      targetAdmin._id.toString() === authResult.admin!.userId &&
      targetAdmin.role === "SUPERADMIN" &&
      role === "ADMIN"
    ) {
      const superAdminCount = await Admin.countDocuments({
        role: "SUPERADMIN",
        accountStatus: "ACTIVE",
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Cannot demote the last active super admin",
          },
          { status: 400 }
        );
      }
    }

    // Update fields
    const updateData: AdminUpdatePayload = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) {
      // Check if new email already exists
      const existingAdmin = await Admin.findOne({
        email: email.toLowerCase(),
        _id: { $ne: resolvedParams.id },
      });
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 409 }
        );
      }
      updateData.email = email.toLowerCase();
    }
    if (role !== undefined && Object.values(AdminRole).includes(role)) {
      updateData.role = role;
    }
    if (
      accountStatus !== undefined &&
      Object.values(AccountStatus).includes(accountStatus)
    ) {
      updateData.accountStatus = accountStatus;
    }
    if (password && password.length >= 8) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "fullName email role accountStatus lastLoginAt createdAt updatedAt"
    );

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      admin: {
        id: updatedAdmin!._id,
        fullName: updatedAdmin!.fullName,
        email: updatedAdmin!.email,
        role: updatedAdmin!.role,
        accountStatus: updatedAdmin!.accountStatus,
        lastLoginAt: updatedAdmin!.lastLoginAt,
        createdAt: updatedAdmin!.createdAt,
        updatedAt: updatedAdmin!.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete admin (Super Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Authenticate admin
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    const resolvedParams = await params;
    await connectDB();

    // Check if the authenticated admin is a super admin
    const admin = await Admin.findById(authResult.admin!.userId);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      );
    }

    // Find the admin to delete
    const targetAdmin = await Admin.findById(resolvedParams.id);
    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Prevent deleting self
    if (targetAdmin._id.toString() === authResult.admin!.userId) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Prevent deleting the last super admin
    if (targetAdmin.role === "SUPERADMIN") {
      const superAdminCount = await Admin.countDocuments({
        role: "SUPERADMIN",
        accountStatus: "ACTIVE",
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { success: false, message: "Cannot delete the last super admin" },
          { status: 400 }
        );
      }
    }

    // Delete admin
    await Admin.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
