import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    required: true
  },
  operatingSystem: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ postId: 1, timestamp: -1 });
pageViewSchema.index({ sessionId: 1, timestamp: -1 });

const postAnalyticsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
    unique: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  uniqueViews: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const analyticsSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  views: Number,
  date: Date
});

export const PageView = mongoose.model('PageView', pageViewSchema);
export const PostAnalytics = mongoose.model('PostAnalytics', postAnalyticsSchema);
export default mongoose.model('Analytics', analyticsSchema);