import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/adminSchema";

export async function GET() {
  try {
    await connectDB();

    // Get all admins from database
    const admins = await Admin.find({}).select(
      "fullName email role accountStatus createdAt"
    );

    console.log("Found admins:", admins);

    return NextResponse.json({
      success: true,
      count: admins.length,
      admins: admins.map((admin) => ({
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        accountStatus: admin.accountStatus,
        createdAt: admin.createdAt,
      })),
    });
  } catch (error) {
    console.error("Database check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
