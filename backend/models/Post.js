import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  author: String,
  content: String,
  image: String,
  intro: String,
  seoDescription: String,
  status: { type: String, enum: ['rascunho', 'publicado', 'inativo'], default: 'rascunho' },
  tags: [String],
  category: String,
  autoriaFoto: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

export default mongoose.model('Post', postSchema);