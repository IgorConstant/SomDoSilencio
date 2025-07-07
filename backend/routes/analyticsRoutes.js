import express from 'express';
import { trackView, getViews } from '../controllers/analyticsController.js';

const router = express.Router();
router.post('/track', trackView);
router.get('/:id', getViews);
export default router;