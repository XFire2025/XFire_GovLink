import mongoose, { Schema, Document } from 'mongoose';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string; // hashed
  accountStatus: AccountStatus;
  lastLoginAt?: Date;
  loginAttempts: number;
  accountLockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // never return password in queries
  },
  accountStatus: {
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.ACTIVE
  },
  lastLoginAt: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  accountLockedUntil: { type: Date }
}, {
  timestamps: true
});

// Indexes for fast lookups
AdminSchema.index({ email: 1 });
AdminSchema.index({ accountStatus: 1 });

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
