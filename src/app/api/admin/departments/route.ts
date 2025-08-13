import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Department from "@/lib/models/department";
import {
  isValidObjectId,
  Types,
  Document,
  FilterQuery,
  ProjectionType,
  SortOrder,
} from "mongoose";

// Define types for better type safety
interface DepartmentBody {
  name: string;
  code: string;
  description: string;
  location: string;
  email: string;
  password: string;
  phone?: string;
  budget?: number | string;
  establishedDate?: string;
  status?: string;
  tags?: string[];
}

interface ValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}

interface MongoError extends Error {
  code?: number;
}

// DB shape (matches your Mongoose schema; adjust if needed)
interface DepartmentDB extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  description: string;
  location: string;
  email: string;
  password?: string;
  phone?: string;
  budget?: number;
  establishedDate?: Date;
  status?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// What we return to clients (no password/__v)
type DepartmentPublic = Omit<DepartmentDB, "password" | "__v">;
type DepartmentWithSensitive = DepartmentPublic & {
  password?: string;
  __v?: number;
};

// Type guards
function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { name?: string }).name === "ValidationError" &&
    "errors" in (error as object)
  );
}

function isMongoError(error: unknown): error is MongoError {
  return typeof error === "object" && error !== null && "code" in error;
}

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = request.nextUrl;

    // Optional field projection: ?fields=name,code,email
    const fieldsParam = searchParams.get("fields");
    let projection: string | ProjectionType<DepartmentDB> | undefined;
    if (fieldsParam) {
      const fields = fieldsParam
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .filter((f) => f !== "password" && f !== "__v"); // never allow password
      projection = fields.length ? fields.join(" ") : undefined; // fallback later
    } else {
      projection = "-password -__v";
    }

    // Single fetch by id or code
    const id = searchParams.get("id");
    const code = searchParams.get("code");

    if (id || code) {
      const filter: FilterQuery<DepartmentDB> = {};

      if (id) {
        if (!isValidObjectId(id)) {
          return NextResponse.json(
            { success: false, error: "Invalid id" },
            { status: 400 }
          );
        }
        filter._id = new Types.ObjectId(id);
      }

      if (code) {
        filter.code = code.trim().toUpperCase();
      }

      const doc = await Department.findOne(filter)
        .select(projection ?? "-password -__v")
        .lean<DepartmentWithSensitive | null>();

      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Department not found" },
          { status: 404 }
        );
      }

      // Strip sensitive fields safely
      const { password: _pw, __v: _v, ...safeDoc } = doc;

      return NextResponse.json(
        { success: true, data: safeDoc as DepartmentPublic },
        { status: 200 }
      );
    }

    // List with pagination, search, filters, sorting
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10) || 1
    );
    const limitCap = 100;
    const parsedLimit = parseInt(searchParams.get("limit") || "20", 10);
    const limit = Math.min(
      limitCap,
      Math.max(1, Number.isFinite(parsedLimit) ? parsedLimit : 20)
    );
    const skip = (page - 1) * limit;

    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const tagsParams = searchParams.getAll("tags"); // supports ?tags=a&tags=b or ?tags=a,b
    const tags = tagsParams
      .flatMap((v) => v.split(","))
      .map((t) => t.trim())
      .filter(Boolean);

    const minBudgetParam = searchParams.get("minBudget");
    const maxBudgetParam = searchParams.get("maxBudget");
    const fromEstablished = searchParams.get("fromEstablishedDate");
    const toEstablished = searchParams.get("toEstablishedDate");

    const filter: FilterQuery<DepartmentDB> = {};

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { name: regex },
        { code: regex },
        { description: regex },
        { email: regex },
        { location: regex },
      ];
    }

    if (status) filter.status = status;
    if (tags.length) filter.tags = { $in: tags };

    const budgetRange: { $gte?: number; $lte?: number } = {};
    const minBudget =
      minBudgetParam !== null ? parseFloat(minBudgetParam) : NaN;
    const maxBudget =
      maxBudgetParam !== null ? parseFloat(maxBudgetParam) : NaN;
    if (Number.isFinite(minBudget)) budgetRange.$gte = minBudget;
    if (Number.isFinite(maxBudget)) budgetRange.$lte = maxBudget;
    if (Object.keys(budgetRange).length) filter.budget = budgetRange;

    const dateRange: { $gte?: Date; $lte?: Date } = {};
    if (fromEstablished) {
      const d = new Date(fromEstablished);
      if (!isNaN(d.getTime())) dateRange.$gte = d;
    }
    if (toEstablished) {
      const d = new Date(toEstablished);
      if (!isNaN(d.getTime())) dateRange.$lte = d;
    }
    if (Object.keys(dateRange).length) filter.establishedDate = dateRange;

    const allowedSorts = new Set([
      "createdAt",
      "updatedAt",
      "name",
      "code",
      "budget",
      "establishedDate",
      "status",
      "location",
    ]);

    const requestedSortBy = (searchParams.get("sortBy") || "createdAt").trim();
    const sortBy = allowedSorts.has(requestedSortBy)
      ? requestedSortBy
      : "createdAt";

    const sortOrder: 1 | -1 =
      (searchParams.get("sortOrder") || "desc").toLowerCase() === "asc"
        ? 1
        : -1;

    const sort: Record<string, SortOrder> = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      Department.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection ?? "-password -__v")
        .lean<DepartmentWithSensitive[]>(),
      Department.countDocuments(filter),
    ]);

    // Strip sensitive fields
    const safeItems: DepartmentPublic[] = items.map(
      ({ password: _pw, __v: _v, ...rest }) => rest
    );

    return NextResponse.json(
      {
        success: true,
        message: "Departments fetched successfully",
        data: safeItems,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new department
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body: DepartmentBody = await request.json();

    // Validate required fields (now includes password)
    const requiredFields: (keyof DepartmentBody)[] = [
      "name",
      "code",
      "description",
      "location",
      "email",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !String(body[field] ?? "").trim()
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Optional: quick password length check (schema also enforces this)
    if (typeof body.password !== "string" || body.password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if department code already exists
    const existingDepartment = await Department.findOne({
      code: body.code.toUpperCase(),
    })
      .select("_id")
      .lean<{ _id: Types.ObjectId } | null>();

    if (existingDepartment) {
      return NextResponse.json(
        {
          success: false,
          error: "Department code already exists",
        },
        { status: 409 }
      );
    }

    // Prepare department data (password is passed raw; schema will hash it)
    const departmentData = {
      name: body.name.trim(),
      code: body.code.trim().toUpperCase(),
      description: body.description.trim(),
      location: body.location.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      // headOfDepartment is not in the schema; add it there if you want to persist it
      budget: body.budget ? parseFloat(String(body.budget)) : undefined,
      establishedDate: body.establishedDate
        ? new Date(body.establishedDate)
        : undefined,
      status: body.status || "active",
      tags: Array.isArray(body.tags)
        ? body.tags.filter((tag: string) => tag.trim())
        : [],
      password: body.password,
    };

    // Create new department
    const departmentDoc = new Department(departmentData);
    await departmentDoc.save();

   // Ensure password is not returned
    const created = departmentDoc.toObject();
    const { password: _pw, __v: _v, ...department } = created;

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully",
        data: department as DepartmentPublic,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating department:", error);

    if (isValidationError(error)) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    if (isMongoError(error) && error.code === 11000) {
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