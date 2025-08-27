import { Router } from 'express';
import authRoutes from './auth';
import questionRoutes from './questions';
import sessionRoutes from './sessions';
import dashboardRoutes from './dashboard';

const router = Router();

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/sessions', sessionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
