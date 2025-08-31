import express from 'express';
import { getLogs, getLogStats } from '../controllers/logController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getLogs);
router.get('/stats', authenticate, getLogStats);

export default router;
