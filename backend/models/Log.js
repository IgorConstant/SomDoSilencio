import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['CREATE_POST', 'UPDATE_POST', 'DELETE_POST', 'LOGIN', 'REGISTER', 'ERROR', 'VIEW_POST']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Para ações que não requerem autenticação
  },
  userEmail: String,
  resourceId: String, // ID do post, usuário, etc.
  resourceType: {
    type: String,
    enum: ['POST', 'USER', 'SYSTEM'],
    required: true
  },
  details: {
    title: String,
    slug: String,
    status: String,
    errorMessage: String,
    ipAddress: String,
    userAgent: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Log', logSchema);
