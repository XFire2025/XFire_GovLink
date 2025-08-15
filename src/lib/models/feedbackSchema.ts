import mongoose, { Schema, Document } from 'mongoose';

// Feedback types
export const FEEDBACK_TYPES = ['general', 'bug', 'feature', 'service'] as const;
export type FeedbackType = typeof FEEDBACK_TYPES[number];

// Feedback status
export const FEEDBACK_STATUS = ['pending', 'reviewed', 'resolved', 'closed'] as const;
export type FeedbackStatus = typeof FEEDBACK_STATUS[number];

// Feedback priority
export const FEEDBACK_PRIORITY = ['low', 'medium', 'high', 'urgent'] as const;
export type FeedbackPriority = typeof FEEDBACK_PRIORITY[number];

// Languages
export const LANGUAGES = ['en', 'si', 'ta'] as const;
export type Language = typeof LANGUAGES[number];

// Rating type
export type Rating = 1 | 2 | 3 | 4 | 5;

// Main Feedback interface
export interface IFeedback extends Document {
  referenceId: string;
  name: string;
  email: string;
  feedbackType: FeedbackType;
  rating?: Rating;
  subject: string;
  message: string;
  language: Language;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminNotes?: string;
  isResolved: boolean;
  resolvedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Feedback Schema
const FeedbackSchema = new Schema<IFeedback>({
  referenceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  feedbackType: {
    type: String,
    enum: FEEDBACK_TYPES,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  language: {
    type: String,
    enum: LANGUAGES,
    required: true,
    default: 'en'
  },
  status: {
    type: String,
    enum: FEEDBACK_STATUS,
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: FEEDBACK_PRIORITY,
    default: 'medium',
    index: true
  },
  submittedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  reviewedAt: {
    type: Date,
    required: false
  },
  reviewedBy: {
    type: String,
    required: false,
    trim: true
  },
  adminNotes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },
  isResolved: {
    type: Boolean,
    default: false,
    index: true
  },
  resolvedAt: {
    type: Date,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive information when converting to JSON
      //delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
FeedbackSchema.index({ email: 1, submittedAt: -1 });
FeedbackSchema.index({ feedbackType: 1, status: 1 });
FeedbackSchema.index({ priority: 1, status: 1, submittedAt: -1 });

// Virtual for feedback age
FeedbackSchema.virtual('ageInDays').get(function(this: IFeedback) {
  const now = new Date();
  const submitted = this.submittedAt;
  const diffTime = Math.abs(now.getTime() - submitted.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to set priority based on feedback type
FeedbackSchema.pre('save', function(this: IFeedback, next) {
  if (this.isNew) {
    // Auto-set priority based on feedback type
    switch (this.feedbackType) {
      case 'bug':
        this.priority = 'high';
        break;
      case 'service':
        this.priority = 'medium';
        break;
      case 'feature':
        this.priority = 'low';
        break;
      default:
        this.priority = 'medium';
    }

    // Generate reference ID if not provided
    if (!this.referenceId) {
      this.referenceId = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  }
  
  next();
});

// Static methods
FeedbackSchema.statics = {
  // Find feedback by reference ID
  findByReferenceId: function(referenceId: string) {
    return this.findOne({ referenceId });
  },

  // Get feedback statistics
  getStats: async function() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          reviewed: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          avgRating: { $avg: '$rating' },
          bugReports: { $sum: { $cond: [{ $eq: ['$feedbackType', 'bug'] }, 1, 0] } },
          featureRequests: { $sum: { $cond: [{ $eq: ['$feedbackType', 'feature'] }, 1, 0] } }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      pending: 0,
      reviewed: 0,
      resolved: 0,
      avgRating: 0,
      bugReports: 0,
      featureRequests: 0
    };
  },

  // Get feedback by type
  findByType: function(feedbackType: FeedbackType, limit: number = 50) {
    return this.find({ feedbackType })
      .sort({ submittedAt: -1 })
      .limit(limit);
  },

  // Get recent feedback
  getRecent: function(days: number = 7, limit: number = 50) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.find({ submittedAt: { $gte: cutoffDate } })
      .sort({ submittedAt: -1 })
      .limit(limit);
  }
};

// Instance methods
FeedbackSchema.methods = {
  // Mark as reviewed
  markAsReviewed: function(reviewedBy: string, adminNotes?: string) {
    this.status = 'reviewed';
    this.reviewedAt = new Date();
    this.reviewedBy = reviewedBy;
    if (adminNotes) {
      this.adminNotes = adminNotes;
    }
    return this.save();
  },

  // Mark as resolved
  markAsResolved: function(reviewedBy?: string, adminNotes?: string) {
    this.status = 'resolved';
    this.isResolved = true;
    this.resolvedAt = new Date();
    if (reviewedBy) {
      this.reviewedBy = reviewedBy;
    }
    if (adminNotes) {
      this.adminNotes = adminNotes;
    }
    return this.save();
  }
};

// Create the model
const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
