import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  views: Number,
  date: Date
});

export default mongoose.model('Analytics', analyticsSchema);