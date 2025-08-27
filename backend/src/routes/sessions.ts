import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authenticateToken } from '../utils/auth';

const router = Router();
const sessionController = new SessionController();

router.post('/', authenticateToken, sessionController.createSession.bind(sessionController));
router.put('/:sessionId', authenticateToken, sessionController.submitSession.bind(sessionController));
router.get('/user', authenticateToken, sessionController.getUserSessions.bind(sessionController));

export default router;
