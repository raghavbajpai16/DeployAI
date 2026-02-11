import { Router } from 'express';
import {
    sendMessage,
    getConversations,
    getConversation,
    getAiResponse,
    updateMessageMetadata,
    getChatStats,
    togglePublicStatus,
    getPublicConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/public/:id', getPublicConversation as any);

router.use(protect as any); // All other chat routes require auth

router.post('/message', sendMessage as any);
router.post('/ai', getAiResponse as any);
router.get('/conversations', getConversations as any);
router.get('/conversations/:id', getConversation as any);
router.post('/conversations/:id/public', togglePublicStatus as any);
router.patch('/conversations/:id/messages/:messageId', updateMessageMetadata as any);
router.get('/stats', getChatStats as any);

export default router;
