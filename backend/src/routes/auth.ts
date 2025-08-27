import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../utils/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export default router;
