import mongoose from "mongoose";

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
        validator: function(v: string) {
          return !v || /^\+?[\d\s-()]+$/.test(v);
        },
        message: "Invalid phone number format"
      }
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: "Invalid email format"
      }
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
        validator: function(v: string[]) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 tags"
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for better query performance
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ status: 1 });
DepartmentSchema.index({ createdAt: -1 });

// Prevent duplicate code across different cases
DepartmentSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

const Department = mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);

export default Department;