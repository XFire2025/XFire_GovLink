import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduledEmail extends Document {
  appointmentId: mongoose.Schema.Types.ObjectId;
  to: string;
  subject: string;
  html: string;
  scheduledAt: Date;
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledEmailSchema: Schema = new Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date }
}, {
  timestamps: true,
});

const ScheduledEmail = mongoose.models.ScheduledEmail || mongoose.model<IScheduledEmail>('ScheduledEmail', ScheduledEmailSchema);
export default ScheduledEmail;
