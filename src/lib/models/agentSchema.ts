import mongoose, { Schema, Document } from 'mongoose';
import { SRI_LANKAN_DISTRICTS, District, SRI_LANKAN_PROVINCES, Province } from './userSchema';

interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: District;
  province: Province;
  postalCode: string;
}

export interface IAgent extends Document {
  fullName: string;
  officerId: string;
  nicNumber: string;
  position: string;
  officeName: string;
  officeAddress: IAddress;
  phoneNumber: string;
  email: string;
  password: string; // For authentication
  duties: string[];
  department?: string;
  branch?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  assignedDistricts?: District[];
  lastLoginAt?: Date;
  loginAttempts: number;
  accountLockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  officerId: { type: String, required: true, unique: true, trim: true },
  nicNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v: string) => /^(\d{9}[VvXx]|\d{12})$/.test(v),
      message: 'Invalid Sri Lankan NIC number'
    }
  },
  position: { type: String, required: true, trim: true },
  officeName: { type: String, required: true, trim: true },
  officeAddress: {
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, enum: SRI_LANKAN_DISTRICTS, required: true },
    province: { type: String, enum: SRI_LANKAN_PROVINCES, required: true },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^\d{5}$/.test(v),
        message: 'Postal code must be 5 digits'
      }
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(\+94|0)([7][01245678]\d{7})$/.test(v),
      message: 'Invalid Sri Lankan phone number'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Never return password in queries
  },
  duties: [{ type: String, trim: true }],
  department: { type: String, trim: true },
  branch: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  assignedDistricts: [{ type: String, enum: SRI_LANKAN_DISTRICTS }],
  
  // Login tracking
  lastLoginAt: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  accountLockedUntil: { type: Date }
}, {
  timestamps: true
});

// Indexes
AgentSchema.index({ officerId: 1 });
AgentSchema.index({ nicNumber: 1 });
AgentSchema.index({ email: 1 });
AgentSchema.index({ isActive: 1 });

const Agent = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
export default Agent;
