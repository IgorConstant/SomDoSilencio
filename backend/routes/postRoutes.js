import express from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/create', authenticate, upload.single('image'), createPost);
router.get('/', getPosts);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;