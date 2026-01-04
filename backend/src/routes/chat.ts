import { Router } from 'express';
import {
    sendMessage,
    getConversations,
    getConversation,
    getAiResponse,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // All chat routes require auth

router.post('/message', sendMessage);
router.post('/ai', getAiResponse);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);

export default router;
