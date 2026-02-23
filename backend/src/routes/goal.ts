import { Router } from 'express';
import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    updateProgress
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect as any);

router.post('/', createGoal as any);
router.get('/', getGoals as any);
router.patch('/:id', updateGoal as any);
router.delete('/:id', deleteGoal as any);
router.patch('/:id/progress', updateProgress as any);

export default router;
