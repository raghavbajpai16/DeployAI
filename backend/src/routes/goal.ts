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

router.use(protect);

router.post('/', createGoal);
router.get('/', getGoals);
router.patch('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.patch('/:id/progress', updateProgress);

export default router;
