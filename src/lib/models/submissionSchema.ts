import mongoose, { Schema, Document } from 'mongoose';
import { SRI_LANKAN_DISTRICTS, District, SRI_LANKAN_PROVINCES, Province } from './userSchema';

export enum SubmissionStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

interface IDocument {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface ISubmissionHistory {
  status: SubmissionStatus;
  comment?: string;
  changedBy: string;
  changedByRole: 'user' | 'agent' | 'department';
  timestamp: Date;
}

export interface ISubmission extends Document {
  submissionId: string;
  userId: string; // Reference to user who submitted
  serviceId: string;
  serviceName: string;
  departmentId: string;
  departmentName: string;
  agentId?: string; // Assigned agent
  
  // Submission Details
  title: string;
  description: string;
  status: SubmissionStatus;
  priority: Priority;
  
  // User Information
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantNIC: string;
  applicantAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: District;
    province: Province;
    postalCode: string;
  };
  
  // Service Specific Data
  formData: Record<string, unknown>;
  documents: IDocument[];
  
  // Processing Information
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  fees?: number;
  feesPaid: boolean;
  paymentReference?: string;
  
  // Tracking
  submittedAt: Date;
  lastUpdatedAt: Date;
  history: ISubmissionHistory[];
  
  // Communication
  comments: {
    id: string;
    message: string;
    author: string;
    authorRole: 'user' | 'agent' | 'department';
    timestamp: Date;
    isInternal: boolean;
  }[];
  
  // Metrics
  processingTimeHours?: number;
  satisfactionRating?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
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

const SubmissionHistorySchema = new Schema({
  status: { type: String, enum: Object.values(SubmissionStatus), required: true },
  comment: { type: String, trim: true },
  changedBy: { type: String, required: true },
  changedByRole: { type: String, enum: ['user', 'agent', 'department'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const CommentSchema = new Schema({
  id: { type: String, required: true },
  message: { type: String, required: true, trim: true },
  author: { type: String, required: true },
  authorRole: { type: String, enum: ['user', 'agent', 'department'], required: true },
  timestamp: { type: Date, default: Date.now },
  isInternal: { type: Boolean, default: false }
});

const SubmissionSchema = new Schema<ISubmission>({
  submissionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  userId: { type: String, required: true, index: true },
  serviceId: { type: String, required: true, index: true },
  serviceName: { type: String, required: true, trim: true },
  departmentId: { type: String, required: true, index: true },
  departmentName: { type: String, required: true, trim: true },
  agentId: { type: String, index: true },
  
  // Submission Details
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: {
    type: String,
    enum: Object.values(SubmissionStatus),
    default: SubmissionStatus.PENDING,
    index: true
  },
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.NORMAL,
    index: true
  },
  
  // User Information
  applicantName: { type: String, required: true, trim: true },
  applicantEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  applicantPhone: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(\+94|0)([7][01245678]\d{7})$/.test(v),
      message: 'Invalid Sri Lankan phone number'
    }
  },
  applicantNIC: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v: string) => /^(\d{9}[VvXx]|\d{12})$/.test(v),
      message: 'Invalid Sri Lankan NIC number'
    }
  },
  applicantAddress: { type: AddressSchema, required: true },
  
  // Service Specific Data
  formData: { type: Schema.Types.Mixed, default: {} },
  documents: [DocumentSchema],
  
  // Processing Information
  expectedCompletionDate: { type: Date },
  actualCompletionDate: { type: Date },
  fees: { type: Number, min: 0 },
  feesPaid: { type: Boolean, default: false },
  paymentReference: { type: String, trim: true },
  
  // Tracking
  submittedAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now },
  history: [SubmissionHistorySchema],
  
  // Communication
  comments: [CommentSchema],
  
  // Metrics
  processingTimeHours: { type: Number, min: 0 },
  satisfactionRating: { type: Number, min: 1, max: 5 }
}, {
  timestamps: true
});

// Indexes for performance
SubmissionSchema.index({ userId: 1, status: 1 });
SubmissionSchema.index({ departmentId: 1, status: 1 });
SubmissionSchema.index({ agentId: 1, status: 1 });
SubmissionSchema.index({ submittedAt: -1 });
SubmissionSchema.index({ 'applicantAddress.district': 1 });

// Pre-save middleware to generate submission ID and update history
SubmissionSchema.pre('save', function(next) {
  // Generate submission ID if not provided
  if (!this.submissionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.submissionId = `SUB${timestamp}${random}`;
  }
  
  // Update lastUpdatedAt
  this.lastUpdatedAt = new Date();
  
  next();
});

const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;