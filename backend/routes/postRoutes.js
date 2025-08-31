import express from 'express';
import { createPost, getPosts, getPostById, getPostBySlug, updatePost, deletePost } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { logActivity } from '../middleware/logger.js';

const router = express.Router();

router.get('/slug/:slug', getPostBySlug);
router.post('/create', authenticate, upload.single('image'), logActivity('CREATE_POST', 'POST'), createPost);
router.get('/', getPosts);
router.get('/:id', authenticate, getPostById);
router.put('/update/:id', authenticate, logActivity('UPDATE_POST', 'POST'), updatePost);
router.delete('/delete/:id', authenticate, logActivity('DELETE_POST', 'POST'), deletePost);

export default router;