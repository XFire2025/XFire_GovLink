import mongoose, {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
  Query,
  UpdateQuery,
} from "mongoose";
import bcrypt from "bcryptjs";

export interface IDepartment extends mongoose.Document {
  name: string;
  code: string;
  description: string;
  location: string;
  phone?: string;
  email: string;
  budget?: number;
  establishedDate?: Date;
  status: "active" | "inactive";
  tags: string[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new mongoose.Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, "Department code cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^\+?[\d\s-()]+$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    establishedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },

    // Password (required on create, optional on update)
    password: {
      type: String,
      required: [
        function (this: IDepartment) {
          return this.isNew;
        },
        "Password is required",
      ],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never return by default
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ status: 1 });
DepartmentSchema.index({ createdAt: -1 });

// Ensure code is uppercase on save
DepartmentSchema.pre(
  "save",
  function (
    this: HydratedDocument<IDepartment>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    if (this.isModified("code")) {
      this.code = this.code.toUpperCase();
    }
    next();
  }
);

// Hash password on save if modified
DepartmentSchema.pre(
  "save",
  async function (
    this: HydratedDocument<IDepartment>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    if (!this.isModified("password")) return next();
    try {
      if (!this.password) {
        return next(new Error("Password is required"));
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err instanceof Error ? err : new Error(String(err)));
    }
  }
);

// Handle updates via findOneAndUpdate (hash password / uppercase code)
DepartmentSchema.pre(
  "findOneAndUpdate",
  async function (
    this: Query<IDepartment | null, IDepartment>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    try {
      const update = (this.getUpdate() ?? {}) as UpdateQuery<IDepartment>;

      // Normalize to $set
      const $set = (update.$set ?? {}) as Partial<IDepartment>;

      // Uppercase code if present (top-level or in $set)
      const topLevel = update as Partial<IDepartment>;
      if (typeof topLevel.code === "string") {
        topLevel.code = topLevel.code.toUpperCase();
      }
      if (typeof $set.code === "string") {
        $set.code = $set.code.toUpperCase();
      }

      // Hash password if a new one is provided
      const candidatePassword: string | undefined =
        (typeof topLevel.password === "string" ? topLevel.password : undefined) ??
        (typeof $set.password === "string" ? $set.password : undefined);

      if (typeof candidatePassword === "string" && candidatePassword.length > 0) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(candidatePassword, salt);

        if (typeof topLevel.password === "string") {
          topLevel.password = hashed;
        } else {
          $set.password = hashed;
        }
      }

      // Write back normalized update
      if (Object.keys($set).length > 0) {
        update.$set = $set as UpdateQuery<IDepartment>["$set"];
      }
      this.setUpdate(update);

      next();
    } catch (err) {
      next(err instanceof Error ? err : new Error(String(err)));
    }
  }
);

const Department =
  mongoose.models.Department ||
  mongoose.model<IDepartment>("Department", DepartmentSchema);

export default Department;