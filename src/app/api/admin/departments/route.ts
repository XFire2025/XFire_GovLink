import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Department from "@/lib/models/department";

// POST - Create a new department
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["name", "code", "description", "location", "email"];
    const missingFields = requiredFields.filter(field => !body[field]?.trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(", ")}` 
        },
        { status: 400 }
      );
    }

    // Check if department code already exists
    const existingDepartment = await Department.findOne({ 
      code: body.code.toUpperCase() 
    });
    
    if (existingDepartment) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Department code already exists" 
        },
        { status: 409 }
      );
    }

    // Prepare department data
    const departmentData = {
      name: body.name.trim(),
      code: body.code.trim().toUpperCase(),
      description: body.description.trim(),
      location: body.location.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      headOfDepartment: body.headOfDepartment?.trim() || undefined,
      budget: body.budget ? parseFloat(body.budget) : undefined,
      establishedDate: body.establishedDate ? new Date(body.establishedDate) : undefined,
      status: body.status || "active",
      tags: Array.isArray(body.tags) ? body.tags.filter(tag => tag.trim()) : [],
    };

    // Create new department
    const department = new Department(departmentData);
    await department.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Department created successfully",
        data: department
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating department:", error);
    
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

// GET - Retrieve all departments with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};
    
    if (status && ["active", "inactive"].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const departments = await Department.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Department.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}