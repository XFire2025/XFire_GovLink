import mongoose, { Schema, Document } from 'mongoose';
import { SRI_LANKAN_DISTRICTS, District, SRI_LANKAN_PROVINCES, Province } from './userSchema';

export enum DepartmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum DepartmentType {
  MINISTRY = 'MINISTRY',
  DEPARTMENT = 'DEPARTMENT',
  AGENCY = 'AGENCY',
  STATUTORY_BOARD = 'STATUTORY_BOARD',
  CORPORATION = 'CORPORATION'
}

interface IContact {
  name: string;
  position: string;
  email: string;
  phone: string;
}

interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: District;
  province: Province;
  postalCode: string;
}

interface IService {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  processingTime: string;
  fee?: number;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepartment extends Document {
  departmentId: string;
  name: string;
  shortName: string;
  description: string;
  type: DepartmentType;
  status: DepartmentStatus;
  
  // Contact Information
  email: string;
  password: string; // hashed password for department login
  phoneNumber: string;
  faxNumber?: string;
  website?: string;
  
  // Address
  address: IAddress;
  
  // Organizational Details
  parentDepartment?: string; // Reference to parent department
  establishedDate?: Date;
  headOfDepartment: IContact;
  contactPersons: IContact[];
  
  // Services and Operations
  services: IService[];
  totalAgents: number;
  activeAgents: number;
  workingHours: {
    monday: { open: string; close: string; isWorkingDay: boolean };
    tuesday: { open: string; close: string; isWorkingDay: boolean };
    wednesday: { open: string; close: string; isWorkingDay: boolean };
    thursday: { open: string; close: string; isWorkingDay: boolean };
    friday: { open: string; close: string; isWorkingDay: boolean };
    saturday: { open: string; close: string; isWorkingDay: boolean };
    sunday: { open: string; close: string; isWorkingDay: boolean };
  };
  
  // Configuration
  allowOnlineServices: boolean;
  requiresAppointment: boolean;
  maxAppointmentsPerDay?: number;
  
  // Authentication and Security
  lastLoginAt?: Date;
  loginAttempts: number;
  accountLockedUntil?: Date;
  
  // Tracking
  createdBy?: string; // Admin ID who created this department
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(\+94|0)([7][01245678]\d{7})$/.test(v),
      message: 'Invalid Sri Lankan phone number'
    }
  }
});

const AddressSchema = new Schema({
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
});

const ServiceSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  processingTime: { type: String, required: true },
  fee: { type: Number, min: 0 },
  requirements: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WorkingHoursSchema = new Schema({
  monday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true }
  },
  tuesday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true }
  },
  wednesday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true }
  },
  thursday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true }
  },
  friday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true }
  },
  saturday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '13:00' },
    isWorkingDay: { type: Boolean, default: false }
  },
  sunday: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '13:00' },
    isWorkingDay: { type: Boolean, default: false }
  }
});

const DepartmentSchema = new Schema<IDepartment>({
  departmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  shortName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: Object.values(DepartmentType),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(DepartmentStatus),
    default: DepartmentStatus.ACTIVE
  },
  
  // Contact Information
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
    select: false
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(\+94|0)([7][01245678]\d{7})$/.test(v),
      message: 'Invalid Sri Lankan phone number'
    }
  },
  faxNumber: { type: String, trim: true },
  website: { type: String, trim: true },
  
  // Address
  address: { type: AddressSchema, required: true },
  
  // Organizational Details
  parentDepartment: { type: String, trim: true },
  establishedDate: { type: Date },
  headOfDepartment: { type: ContactSchema, required: true },
  contactPersons: [ContactSchema],
  
  // Services and Operations
  services: [ServiceSchema],
  totalAgents: { type: Number, default: 0 },
  activeAgents: { type: Number, default: 0 },
  workingHours: { type: WorkingHoursSchema, default: () => ({}) },
  
  // Configuration
  allowOnlineServices: { type: Boolean, default: true },
  requiresAppointment: { type: Boolean, default: false },
  maxAppointmentsPerDay: { type: Number, min: 1 },
  
  // Authentication and Security
  lastLoginAt: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  accountLockedUntil: { type: Date },
  
  // Tracking
  createdBy: { type: String, trim: true }
}, {
  timestamps: true
});

// Indexes for performance
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ status: 1 });
DepartmentSchema.index({ type: 1 });
DepartmentSchema.index({ 'address.district': 1 });
DepartmentSchema.index({ 'address.province': 1 });

// Pre-save middleware to generate department ID if not provided
DepartmentSchema.pre('save', function(next) {
  if (!this.departmentId) {
    const prefix = this.type.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.departmentId = `${prefix}${timestamp}`;
  }
  next();
});

const Department = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
export default Department;