import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { authenticateToken } from '../utils/auth';

const router = Router();
const questionController = new QuestionController();

router.get('/', authenticateToken, questionController.getQuestions.bind(questionController));
router.get('/topics', authenticateToken, questionController.getTopics.bind(questionController));
router.get('/session', authenticateToken, questionController.getQuestionsForSession.bind(questionController));
router.post('/', authenticateToken, questionController.createQuestion.bind(questionController));

export default router;
