import mongoose, { Schema, Document } from 'mongoose';

// Sri Lankan Districts
export const SRI_LANKAN_DISTRICTS = [
  // Western Province
  'Colombo', 'Gampaha', 'Kalutara',
  // Central Province
  'Kandy', 'Matale', 'Nuwara Eliya',
  // Southern Province
  'Galle', 'Matara', 'Hambantota',
  // Northern Province
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu',
  // Eastern Province
  'Batticaloa', 'Ampara', 'Trincomalee',
  // North Western Province
  'Kurunegala', 'Puttalam',
  // North Central Province
  'Anuradhapura', 'Polonnaruwa',
  // Uva Province
  'Badulla', 'Moneragala',
  // Sabaragamuwa Province
  'Ratnapura', 'Kegalle'
] as const;

export type District = typeof SRI_LANKAN_DISTRICTS[number];

// Sri Lankan Provinces
export const SRI_LANKAN_PROVINCES = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern', 
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
] as const;

export type Province = typeof SRI_LANKAN_PROVINCES[number];

// Language preferences
export const LANGUAGES = ['en', 'si', 'ta'] as const;
export type Language = typeof LANGUAGES[number];

// Gender options
export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const;
export type Gender = typeof GENDERS[number];

// User role types
export const USER_ROLES = ['citizen', 'agent', 'admin'] as const;
export type UserRole = typeof USER_ROLES[number];

// Profile completion status
export const PROFILE_STATUS = [
  'incomplete',    // Just registered, basic info only
  'pending',       // Profile submitted, awaiting verification
  'verified',      // Profile verified by admin
  'rejected'       // Profile verification rejected
] as const;
export type ProfileStatus = typeof PROFILE_STATUS[number];

// Account status
export const ACCOUNT_STATUS = [
  'pending_verification', 
  'active', 
  'suspended', 
  'deactivated',
  'under_review'
] as const;
export type AccountStatus = typeof ACCOUNT_STATUS[number];

// Verification status
export const VERIFICATION_STATUS = [
  'unverified',
  'email_verified',
  'phone_verified', 
  'documents_submitted',
  'partially_verified',
  'fully_verified',
  'verification_failed'
] as const;
export type VerificationStatus = typeof VERIFICATION_STATUS[number];

// Address interface
export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: District;
  province: Province;
  postalCode: string;
}

// Emergency contact interface
export interface IEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

// Document interface for verification
export interface IDocument {
  type: 'nic_front' | 'nic_back' | 'passport' | 'birth_certificate' | 'utility_bill' | 'other';
  url: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

// User interface
export interface IUser extends Document {
  // ===== ESSENTIAL REGISTRATION FIELDS =====
  // Basic Information (Required at registration)
  fullName: string;
  email: string;
  password: string;
  
  // Critical Identity Information (Required at registration)
  nicNumber: string; // National Identity Card number - REQUIRED
  dateOfBirth: Date; // REQUIRED for age verification
  mobileNumber: string; // REQUIRED for OTP verification
  
  // System Information
  role: UserRole;
  accountStatus: AccountStatus;
  profileStatus: ProfileStatus; // Track profile completion
  preferredLanguage: Language;
  
  // ===== PROFILE COMPLETION FIELDS (Optional at registration) =====
  // Additional Names
  nameInSinhala?: string;
  nameInTamil?: string;
  
  // Additional Identity Information
  passportNumber?: string;
  gender?: Gender;
  nationality?: string; // Default to "Sri Lankan"
  
  // Contact Information
  alternativePhoneNumber?: string;
  
  // Address Information
  permanentAddress?: IAddress;
  currentAddress?: IAddress;
  isSameAddress?: boolean; // If current address is same as permanent
  
  // Verification and Documents
  verificationStatus: VerificationStatus;
  profilePicture?: string;
  documents: IDocument[];
  
  // Emergency Contact
  emergencyContact?: IEmergencyContact;
  
  // Preferences
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Security
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  accountLockedUntil?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;
  
  // Audit Trail
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  
  // Service Usage
  servicesUsed: string[];
  appointmentHistory: string[];
  submissionHistory: string[];
}

// User Schema
const UserSchema: Schema = new Schema({
  // ===== ESSENTIAL REGISTRATION FIELDS =====
  // Basic Information (Required at registration)
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Critical Identity Information (Required at registration)
  nicNumber: {
    type: String,
    required: [true, 'NIC number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Sri Lankan NIC validation (old: 9 digits + V/X, new: 12 digits)
        return /^(\d{9}[VvXx]|\d{12})$/.test(v);
      },
      message: 'Please enter a valid Sri Lankan NIC number'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v: Date) {
        const today = new Date();
        const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        const maxAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()); // Minimum 16 years old
        return v <= maxAge && v >= minAge;
      },
      message: 'You must be at least 16 years old to register'
    }
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v: string) {
        // Sri Lankan mobile number validation
        return /^(\+94|0)([7][01245678]\d{7})$/.test(v);
      },
      message: 'Please enter a valid Sri Lankan mobile number'
    }
  },
  
  // System Information
  role: {
    type: String,
    enum: USER_ROLES,
    default: 'citizen'
  },
  accountStatus: {
    type: String,
    enum: ACCOUNT_STATUS,
    default: 'pending_verification'
  },
  profileStatus: {
    type: String,
    enum: PROFILE_STATUS,
    default: 'incomplete'
  },
  preferredLanguage: {
    type: String,
    enum: LANGUAGES,
    default: 'en'
  },
  
  // ===== PROFILE COMPLETION FIELDS (Optional at registration) =====
  // Additional Names
  nameInSinhala: {
    type: String,
    trim: true,
    maxlength: [100, 'Sinhala name cannot exceed 100 characters']
  },
  nameInTamil: {
    type: String,
    trim: true,
    maxlength: [100, 'Tamil name cannot exceed 100 characters']
  },
  
  // Additional Identity Information  
  passportNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  gender: {
    type: String,
    enum: GENDERS
  },
  nationality: {
    type: String,
    default: 'Sri Lankan',
    trim: true
  },
  
  // Contact Information
  alternativePhoneNumber: {
    type: String,
    trim: true
  },
  
  // Address Information
  permanentAddress: {
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { 
      type: String, 
      enum: SRI_LANKAN_DISTRICTS
    },
    province: { 
      type: String, 
      enum: SRI_LANKAN_PROVINCES
    },
    postalCode: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^\d{5}$/.test(v);
        },
        message: 'Please enter a valid 5-digit postal code'
      }
    }
  },
  currentAddress: {
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { 
      type: String, 
      enum: SRI_LANKAN_DISTRICTS
    },
    province: { 
      type: String, 
      enum: SRI_LANKAN_PROVINCES
    },
    postalCode: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^\d{5}$/.test(v);
        },
        message: 'Please enter a valid 5-digit postal code'
      }
    }
  },
  isSameAddress: {
    type: Boolean,
    default: true
  },
  
  // Verification and Documents
  verificationStatus: {
    type: String,
    enum: VERIFICATION_STATUS,
    default: 'unverified'
  },
  profilePicture: {
    type: String, // URL to the image
    trim: true
  },
  documents: [{
    type: {
      type: String,
      enum: ['nic_front', 'nic_back', 'passport', 'birth_certificate', 'utility_bill', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: String
  }],
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true }
  },
  
  // Preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLoginAt: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date,
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date,
  phoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerifiedAt: Date,
  
  // Service Usage
  servicesUsed: [{ type: String }],
  appointmentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  submissionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  
  // Audit Trail
  createdBy: String,
  lastModifiedBy: String
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc: Document, ret: Record<string, unknown>) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ nicNumber: 1 });
UserSchema.index({ mobileNumber: 1 });
UserSchema.index({ accountStatus: 1 });
UserSchema.index({ verificationStatus: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full address
UserSchema.virtual('fullPermanentAddress').get(function(this: IUser) {
  if (!this.permanentAddress) return '';
  const addr = this.permanentAddress as IAddress;
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.district, addr.province, addr.postalCode]
    .filter(Boolean)
    .join(', ');
});

// Virtual for age calculation
UserSchema.virtual('age').get(function(this: IUser) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to copy permanent address to current address if they're the same
UserSchema.pre('save', function(this: IUser, next) {
  if (this.isSameAddress && this.permanentAddress) {
    this.currentAddress = { ...this.permanentAddress };
  }
  next();
});

// Instance method to check if user is eligible for certain services
UserSchema.methods.isEligibleForService = function(serviceType: string) {
  // Example eligibility rules
  switch (serviceType) {
    case 'voting':
      return this.age && this.age >= 18 && this.verificationStatus === 'fully_verified';
    case 'passport':
      return this.verificationStatus === 'fully_verified' && this.nicNumber;
    case 'driving_license':
      return this.age && this.age >= 18 && this.verificationStatus === 'fully_verified';
    default:
      return this.accountStatus === 'active';
  }
};

// Static method to find users by district
UserSchema.statics.findByDistrict = function(district: District) {
  return this.find({
    $or: [
      { 'permanentAddress.district': district },
      { 'currentAddress.district': district }
    ]
  });
};

// Create and export the model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
