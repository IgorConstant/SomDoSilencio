import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  mfaSecret: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);