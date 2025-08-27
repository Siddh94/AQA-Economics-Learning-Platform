import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../utils/auth';

const router = Router();
const dashboardController = new DashboardController();

router.get('/', authenticateToken, dashboardController.getDashboardData.bind(dashboardController));
router.get('/analytics', authenticateToken, dashboardController.getProgressAnalytics.bind(dashboardController));

export default router;
