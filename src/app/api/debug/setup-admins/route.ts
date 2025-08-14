import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin, { AdminRole, AccountStatus } from "@/lib/models/adminSchema";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    console.log("🔍 Setting up admin accounts...");

    // Check existing admins
    const existingAdmins = await Admin.find({});
    console.log("Existing admins found:", existingAdmins.length);

    // Super Admin setup
    const superAdminEmail = "superadmin@govlink.lk";
    let superAdmin = await Admin.findOne({ email: superAdminEmail });

    if (!superAdmin) {
      console.log("Creating Super Admin...");
      const hashedPassword = await bcrypt.hash("ThisIsInsane", 12);

      superAdmin = new Admin({
        fullName: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        role: AdminRole.SUPERADMIN,
        accountStatus: AccountStatus.ACTIVE,
      });

      await superAdmin.save();
      console.log("✅ Super Admin created");
    } else {
      // Update existing super admin to have correct role
      if (superAdmin.role !== AdminRole.SUPERADMIN) {
        superAdmin.role = AdminRole.SUPERADMIN;
        await superAdmin.save();
        console.log("✅ Super Admin role updated");
      } else {
        console.log("✅ Super Admin already exists");
      }
    }

    // Regular Admin setup
    const regularAdminEmail = "admin@govlink.lk";
    let regularAdmin = await Admin.findOne({ email: regularAdminEmail });

    if (!regularAdmin) {
      console.log("Creating Regular Admin...");
      const hashedPassword = await bcrypt.hash("TestAdmin123", 12);

      regularAdmin = new Admin({
        fullName: "Regular Admin",
        email: regularAdminEmail,
        password: hashedPassword,
        role: AdminRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
      });

      await regularAdmin.save();
      console.log("✅ Regular Admin created");
    } else {
      // Ensure regular admin has correct role
      if (regularAdmin.role !== AdminRole.ADMIN) {
        regularAdmin.role = AdminRole.ADMIN;
        await regularAdmin.save();
        console.log("✅ Regular Admin role updated");
      } else {
        console.log("✅ Regular Admin already exists");
      }
    }

    // Check if there are any existing admins without roles and update them
    const adminsWithoutRole = await Admin.find({ role: { $exists: false } });
    if (adminsWithoutRole.length > 0) {
      console.log(
        `Found ${adminsWithoutRole.length} admins without roles, updating...`
      );
      for (const admin of adminsWithoutRole) {
        // Check if this might be the super admin based on email
        if (admin.email === superAdminEmail) {
          admin.role = AdminRole.SUPERADMIN;
        } else {
          admin.role = AdminRole.ADMIN;
        }
        await admin.save();
      }
      console.log("✅ Updated admins without roles");
    }

    // Get final list of all admins
    const allAdmins = await Admin.find({}).select(
      "fullName email role accountStatus createdAt"
    );

    return NextResponse.json({
      success: true,
      message: "Admin setup completed successfully",
      admins: allAdmins.map((admin) => ({
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        accountStatus: admin.accountStatus,
        createdAt: admin.createdAt,
      })),
      credentials: {
        superAdmin: {
          email: "superadmin@govlink.lk",
          password: "ThisIsInsane",
        },
        regularAdmin: {
          email: "admin@govlink.lk",
          password: "TestAdmin123",
        },
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Admin setup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
