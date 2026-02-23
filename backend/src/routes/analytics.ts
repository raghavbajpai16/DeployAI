import { Router } from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect as any);

router.get('/dashboard', getDashboardStats as any);

export default router;
