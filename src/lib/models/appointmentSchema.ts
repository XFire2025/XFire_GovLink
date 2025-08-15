// lib/models/appointmentSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

// Service types for government appointments
export const SERVICE_TYPES = [
  'passport', 'license', 'certificate', 'registration', 'visa'
] as const;
export type ServiceType = typeof SERVICE_TYPES[number];

// Appointment status
export const APPOINTMENT_STATUS = [
  'pending', 'confirmed', 'cancelled', 'completed'
] as const;
export type AppointmentStatus = typeof APPOINTMENT_STATUS[number];

// Priority levels
export const PRIORITY_LEVELS = ['normal', 'urgent'] as const;
export type PriorityLevel = typeof PRIORITY_LEVELS[number];

// NEW: Define an interface for a single uploaded document
export interface IAppointmentDocument {
  name: string; // The logical name from the form, e.g., 'applicationForm'
  label: string; // The user-facing label, e.g., 'Application Form'
  url: string; // The URL from R2
  fileName: string; // The original file name, e.g., 'my_id_scan.pdf'
  fileType: string; // The MIME type, e.g., 'application/pdf'
  fileSize: number; // File size in bytes
  uploadedAt: Date;
}

export interface IAppointment extends Document {
  // Citizen Information
  citizenId: mongoose.Schema.Types.ObjectId; // Reference to User
  citizenName: string;
  citizenNIC: string;
  contactEmail: string;
  contactPhone: string;
  
  // Service Information  
  serviceType: ServiceType;
  department?: string;
  
  // Appointment Details
  date: Date;
  time: string; // Format: "HH:MM"
  status: AppointmentStatus;
  priority: PriorityLevel;
  
  // Agent/Office Information
  assignedAgent?: mongoose.Schema.Types.ObjectId; // Reference to Agent
  assignedOffice?: string;
  
  // Additional Information
  notes?: string;
  agentNotes?: string; // Internal notes by agent
  requirements?: string[]; // Documents/requirements needed
  documents: IAppointmentDocument[]; // NEW: Add the documents array
  
  // QR Code Information
  qrCode?: {
    data: string; // QR code data (booking reference + appointment details)
    imageUrl?: string; // URL to QR code image stored in R2
    generatedAt: Date;
  };
  
  // System Information
  bookingReference: string; // Unique booking ID
  submittedDate: Date;
  confirmedDate?: Date;
  completedDate?: Date;
  cancelledDate?: Date;
  cancellationReason?: string;
  
  // Notifications
  notificationsSent: {
    email: boolean;
    sms: boolean;
    lastSentAt?: Date;
  };
  
  // Audit Trail
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: string;
}

const AppointmentSchema: Schema = new Schema({
  // Citizen Information
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Citizen ID is required']
  },
  citizenName: {
    type: String,
    required: [true, 'Citizen name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  citizenNIC: {
    type: String,
    required: [true, 'Citizen NIC is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^(\d{9}[VvXx]|\d{12})$/.test(v);
      },
      message: 'Please enter a valid Sri Lankan NIC number'
    }
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    validate: {
      validator: function(v: string) {
        return /^(\+94|0)([7][01245678]\d{7})$/.test(v);
      },
      message: 'Please enter a valid Sri Lankan mobile number'
    }
  },
  
  // Service Information
  serviceType: {
    type: String,
    enum: SERVICE_TYPES,
    required: [true, 'Service type is required']
  },
  department: {
    type: String,
    trim: true
  },
  
  // Appointment Details
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(v: Date) {
        // Appointment date must be in the future
        return v > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    validate: {
      validator: function(v: string) {
        // Validate time format HH:MM
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Please enter a valid time in HH:MM format'
    }
  },
  status: {
    type: String,
    enum: APPOINTMENT_STATUS,
    default: 'pending'
  },
  priority: {
    type: String,
    enum: PRIORITY_LEVELS,
    default: 'normal'
  },
  
  // Agent/Office Information
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  assignedOffice: {
    type: String,
    trim: true
  },
  
  // Additional Information
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  agentNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Agent notes cannot exceed 1000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  // NEW: Add the schema definition for the documents array
  documents: [{
    name: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // QR Code Information
  qrCode: {
    data: { type: String },
    imageUrl: { type: String },
    generatedAt: { type: Date, default: Date.now }
  },
  
  // System Information
  bookingReference: {
    type: String,
    required: true,
    uppercase: true
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  confirmedDate: Date,
  completedDate: Date,
  cancelledDate: Date,
  cancellationReason: {
    type: String,
    trim: true
  },
  
  // Notifications
  notificationsSent: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    lastSentAt: Date
  },
  
  // Audit Trail
  lastModifiedBy: String
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc: Document, ret: Record<string, unknown>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
AppointmentSchema.index({ citizenId: 1 });
AppointmentSchema.index({ citizenNIC: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ serviceType: 1 });
AppointmentSchema.index({ date: 1, time: 1 });
AppointmentSchema.index({ assignedAgent: 1 });
AppointmentSchema.index({ bookingReference: 1 }, { unique: true });
AppointmentSchema.index({ submittedDate: -1 });

// Compound indexes for common queries
AppointmentSchema.index({ status: 1, date: 1 });
AppointmentSchema.index({ serviceType: 1, status: 1 });
AppointmentSchema.index({ assignedAgent: 1, status: 1 });

// Virtual for formatted date
AppointmentSchema.virtual('formattedDate').get(function(this: IAppointment) {
  return this.date ? this.date.toISOString().split('T')[0] : '';
});

// Virtual for full appointment datetime
AppointmentSchema.virtual('appointmentDateTime').get(function(this: IAppointment) {
  if (!this.date || !this.time) return null;
  const [hours, minutes] = this.time.split(':');
  const appointmentDate = new Date(this.date);
  appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return appointmentDate;
});

// Pre-save middleware to generate booking reference
AppointmentSchema.pre('save', async function(this: IAppointment, next) {
  if (this.isNew && !this.bookingReference) {
    // Generate unique booking reference: APT + YYMMDD + random 4 digits
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    
    this.bookingReference = `APT${year}${month}${day}${random}`;
  }
  next();
});

// Instance method to check if appointment is modifiable
AppointmentSchema.methods.isModifiable = function() {
  return this.status === 'pending' || this.status === 'confirmed';
};

// Instance method to check if appointment is today
AppointmentSchema.methods.isToday = function() {
  if (!this.date) return false;
  const today = new Date();
  const appointmentDate = new Date(this.date);
  return today.toDateString() === appointmentDate.toDateString();
};

// Static method to find appointments by date range
AppointmentSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('citizenId', 'fullName email mobileNumber');
};

// Static method to find appointments by agent
AppointmentSchema.statics.findByAgent = function(agentId: string) {
  return this.find({ assignedAgent: agentId })
    .populate('citizenId', 'fullName email mobileNumber')
    .sort({ date: 1, time: 1 });
};

// Create and export the model
const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;


