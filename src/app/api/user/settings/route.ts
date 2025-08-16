import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/user-jwt";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/userSchema";

export async function PUT(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 }
      );
    }

    const { emailNotifications, language } = await request.json();

    await connectToDatabase();

    // Find and update user settings
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          "preferences.emailNotifications": emailNotifications,
          "preferences.language": language,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        emailNotifications: updatedUser.preferences?.emailNotifications ?? true,
        language: updatedUser.preferences?.language ?? "en",
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId).select("preferences");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        emailNotifications: user.preferences?.emailNotifications ?? true,
        language: user.preferences?.language ?? "en",
      },
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
