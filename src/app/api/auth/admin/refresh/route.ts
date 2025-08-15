import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/auth/admin-auth-service";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies or request body
    let refreshToken: string | undefined;

    // First try to get from cookies
    refreshToken = request.cookies.get("admin_refresh_token")?.value;

    // If not in cookies, try request body (fallback for explicit token refresh)
    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch {
        // Ignore JSON parsing errors if no body
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
          errors: ["No refresh token provided"],
        },
        { status: 401 }
      );
    }

    // Refresh admin token using AdminAuthService
    const result = await AdminAuthService.refreshAdminToken(refreshToken);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set new cookies if refresh successful
    const response = NextResponse.json(result, { status });

    if (result.success && result.tokens) {
      // Set secure HTTP-only cookies with new tokens
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
    console.error("Admin token refresh API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: ["Token refresh failed due to server error"],
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
