import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Department from "@/lib/models/department";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateDepartmentBody {
  name?: string;
  code?: string;
  description?: string;
  location?: string;
  email?: string;
  phone?: string | null;
  budget?: number | null;
  establishedDate?: string | null;
  status?: "active" | "inactive";
  tags?: string[];
  password?: string;
}

// Type for Mongoose validation error
interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

// Type for MongoDB duplicate key error
interface MongoDBDuplicateKeyError extends Error {
  code: 11000;
  keyPattern?: { [key: string]: number };
  keyValue?: { [key: string]: string };
}

// Type guard for Mongoose validation error
function isMongooseValidationError(error: unknown): error is MongooseValidationError {
  return error instanceof Error && error.name === "ValidationError" && "errors" in error;
}

// Type guard for MongoDB duplicate key error
function isMongoDBDuplicateKeyError(error: unknown): error is MongoDBDuplicateKeyError {
  return error instanceof Error && "code" in error && (error as MongoDBDuplicateKeyError).code === 11000;
}

// GET - Retrieve a single department by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid department ID",
        },
        { status: 400 }
      );
    }

    // Exclude password from the response
    const department = await Department.findById(id).select("-password");

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a department
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = await params;
    const body: UpdateDepartmentBody = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid department ID",
        },
        { status: 400 }
      );
    }

    // Check if department exists
    const existingDepartment = await Department.findById(id);
    if (!existingDepartment) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    // If updating code, check for duplicates
    if (body.code && body.code.toUpperCase() !== existingDepartment.code) {
      const codeExists = await Department.findOne({
        code: body.code.toUpperCase(),
        _id: { $ne: id },
      });

      if (codeExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Department code already exists",
          },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.code !== undefined) updateData.code = body.code.trim().toUpperCase();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.location !== undefined) updateData.location = body.location.trim();
    if (body.email !== undefined) updateData.email = body.email.trim().toLowerCase();
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || undefined;
    // Preserve 0 with nullish coalescing
    if (body.budget !== undefined) updateData.budget = body.budget ?? undefined;
    if (body.establishedDate !== undefined)
      updateData.establishedDate = body.establishedDate ? new Date(body.establishedDate) : undefined;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.tags !== undefined)
      updateData.tags = Array.isArray(body.tags) ? body.tags.filter((tag: string) => !!tag.trim()) : [];

    // Handle password update
    if (body.password !== undefined) {
      if (body.password.length < 8) {
        return NextResponse.json(
          {
            success: false,
            error: "Password must be at least 8 characters",
          },
          { status: 400 }
        );
      }
      updateData.password = body.password; // Will be hashed by pre-save hook
    }

    // Update department
    const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");

    return NextResponse.json({
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error: unknown) {
    console.error("Error updating department:", error);

    // Handle mongoose validation errors
    if (isMongooseValidationError(error)) {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle mongoose duplicate key error
    if (isMongoDBDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: "Department code already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a department
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid department ID",
        },
        { status: 400 }
      );
    }

    const department = await Department.findByIdAndDelete(id).select("-password");

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Department deleted successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }}