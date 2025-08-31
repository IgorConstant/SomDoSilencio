import express from 'express';
import { 
  trackView, 
  getViews, 
  trackPageView, 
  getDashboardData, 
  getPostAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/track', trackView);
router.get('/:id', getViews);

router.post('/track-page', trackPageView);
router.get('/dashboard/data', getDashboardData);
router.get('/post/:postId', getPostAnalytics);

export default router;