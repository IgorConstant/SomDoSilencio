import express from 'express';
import { createPost, getPosts, getPostById, getPostBySlug, updatePost, deletePost } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/slug/:slug', getPostBySlug);
router.post('/create', authenticate, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', authenticate, getPostById);
router.put('/update/:id', authenticate, updatePost);
router.delete('/delete/:id', authenticate, deletePost);

export default router;