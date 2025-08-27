"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const database_1 = require("../utils/database");
const models_1 = require("../models");
const AdaptiveService_1 = require("../services/AdaptiveService");
class SessionController {
    constructor() {
        this.sessionRepository = database_1.AppDataSource.getRepository(models_1.Session);
        this.userRepository = database_1.AppDataSource.getRepository(models_1.User);
        this.questionRepository = database_1.AppDataSource.getRepository(models_1.Question);
        this.adaptiveService = new AdaptiveService_1.AdaptiveService();
    }
    async createSession(req, res) {
        try {
            const userId = req.userId;
            // Get user's current difficulty level
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Get questions for this session
            const questions = await this.adaptiveService.getQuestionsForSession(user.currentDifficultyLevel);
            if (questions.length === 0) {
                return res.status(400).json({ error: 'No questions available for this difficulty level' });
            }
            // Create session
            const session = this.sessionRepository.create({
                userId,
                questions: questions.map(q => q.id),
                answers: [],
                score: 0,
                difficultyLevel: user.currentDifficultyLevel,
                timeSpent: 0
            });
            await this.sessionRepository.save(session);
            // Return questions without correct answers
            const questionsForQuiz = questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                topic: q.topic,
                difficultyLevel: q.difficultyLevel
            }));
            res.status(201).json({
                sessionId: session.id,
                questions: questionsForQuiz,
                difficultyLevel: user.currentDifficultyLevel
            });
        }
        catch (error) {
            console.error('Create session error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async submitSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { answers, timeSpent } = req.body;
            const userId = req.userId;
            // Find session
            const session = await this.sessionRepository.findOne({
                where: { id: sessionId, userId }
            });
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            // Get questions with correct answers
            const questions = await this.questionRepository.findByIds(session.questions);
            // Calculate score
            const score = this.adaptiveService.calculateScore(answers, questions);
            // Update session
            session.answers = answers;
            session.score = score;
            session.timeSpent = timeSpent;
            await this.sessionRepository.save(session);
            // Update user progress
            await this.adaptiveService.updateUserProgress(userId, questions, answers);
            // Calculate new difficulty level
            const user = await this.userRepository.findOne({ where: { id: userId } });
            const newDifficultyLevel = this.adaptiveService.calculateNewDifficultyLevel(user.currentDifficultyLevel, score);
            // Update user's difficulty level if changed
            if (newDifficultyLevel !== user.currentDifficultyLevel) {
                await this.adaptiveService.updateUserDifficultyLevel(userId, newDifficultyLevel);
            }
            // Prepare detailed results
            const results = questions.map((question, index) => ({
                questionId: question.id,
                question: question.text,
                options: question.options,
                userAnswer: answers[index],
                correctAnswer: question.correctAnswer,
                isCorrect: answers[index] === question.correctAnswer,
                topic: question.topic,
                explanation: question.explanation
            }));
            res.json({
                sessionId: session.id,
                score,
                totalQuestions: questions.length,
                correctAnswers: results.filter(r => r.isCorrect).length,
                timeSpent,
                oldDifficultyLevel: user.currentDifficultyLevel,
                newDifficultyLevel,
                results
            });
        }
        catch (error) {
            console.error('Submit session error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getUserSessions(req, res) {
        try {
            const userId = req.userId;
            const { limit = 10 } = req.query;
            const sessions = await this.sessionRepository
                .createQueryBuilder('session')
                .where('session.userId = :userId', { userId })
                .orderBy('session.completedAt', 'DESC')
                .limit(Number(limit))
                .getMany();
            res.json(sessions);
        }
        catch (error) {
            console.error('Get user sessions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.SessionController = SessionController;
