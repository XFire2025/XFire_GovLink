import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Department from "@/lib/models/department";
import mongoose from "mongoose";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Retrieve a single department by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid department ID" 
        },
        { status: 400 }
      );
    }

    const department = await Department.findById(id);

    if (!department) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Department not found" 
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
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a department
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid department ID" 
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
          error: "Department not found" 
        },
        { status: 404 }
      );
    }

    // If updating code, check for duplicates
    if (body.code && body.code.toUpperCase() !== existingDepartment.code) {
      const codeExists = await Department.findOne({ 
        code: body.code.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (codeExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Department code already exists" 
          },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.name) updateData.name = body.name.trim();
    if (body.code) updateData.code = body.code.trim().toUpperCase();
    if (body.description) updateData.description = body.description.trim();
    if (body.location) updateData.location = body.location.trim();
    if (body.email) updateData.email = body.email.trim().toLowerCase();
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null;
    if (body.headOfDepartment !== undefined) updateData.headOfDepartment = body.headOfDepartment?.trim() || null;
    if (body.budget !== undefined) updateData.budget = body.budget ? parseFloat(body.budget) : null;
    if (body.establishedDate !== undefined) updateData.establishedDate = body.establishedDate ? new Date(body.establishedDate) : null;
    if (body.status) updateData.status = body.status;
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags.filter((tag: string) => tag.trim()) : [];

    // Update department
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    return NextResponse.json({
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });

  } catch (error: any) {
    console.error("Error updating department:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Department code already exists" 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a department
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid department ID" 
        },
        { status: 400 }
      );
    }

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Department not found" 
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
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
