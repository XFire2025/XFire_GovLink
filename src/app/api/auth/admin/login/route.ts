import { NextRequest, NextResponse } from "next/server";
import {
  AdminAuthService,
  AdminLoginData,
} from "@/lib/auth/admin-auth-service";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: AdminLoginData = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
          errors: ["Missing email or password"],
        },
        { status: 400 }
      );
    }

    // Login admin
    const result = await AdminAuthService.loginAdmin(body);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set cookies if login successful
    const response = NextResponse.json(result, { status });

    if (result.success && result.tokens) {
      // Set secure HTTP-only cookies
      response.cookies.set("admin_access_token", result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60, // 15 minutes
        path: "/",
      });

      response.cookies.set("admin_refresh_token", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Login failed due to server error"],
      },
      { status: 500 }
    );
  }
}
