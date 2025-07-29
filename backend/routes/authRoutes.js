import express from 'express';
import { login, register } from '../controllers/authController.js';
import { verifyMFA } from '../middleware/mfa.js';

const router = express.Router();
router.post('/login', verifyMFA, login);
router.post('/register', register);
export default router;