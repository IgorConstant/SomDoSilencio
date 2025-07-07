import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: String
});

export default mongoose.model('Category', categorySchema);
