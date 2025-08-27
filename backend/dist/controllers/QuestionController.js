"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const database_1 = require("../utils/database");
const Question_1 = require("../models/Question");
const AdaptiveService_1 = require("../services/AdaptiveService");
class QuestionController {
    constructor() {
        this.questionRepository = database_1.AppDataSource.getRepository(Question_1.Question);
        this.adaptiveService = new AdaptiveService_1.AdaptiveService();
    }
    async getQuestions(req, res) {
        try {
            const { difficulty, topic, limit = 10 } = req.query;
            let queryBuilder = this.questionRepository.createQueryBuilder('question');
            if (difficulty) {
                queryBuilder = queryBuilder.where('question.difficultyLevel = :difficulty', { difficulty: Number(difficulty) });
            }
            if (topic) {
                queryBuilder = queryBuilder.andWhere('question.topic = :topic', { topic });
            }
            const questions = await queryBuilder
                .orderBy('RANDOM()')
                .limit(Number(limit))
                .getMany();
            res.json(questions);
        }
        catch (error) {
            console.error('Get questions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getTopics(req, res) {
        try {
            const topics = await this.questionRepository
                .createQueryBuilder('question')
                .select('DISTINCT question.topic', 'topic')
                .getRawMany();
            res.json(topics.map(t => t.topic));
        }
        catch (error) {
            console.error('Get topics error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async createQuestion(req, res) {
        try {
            const { text, options, correctAnswer, topic, difficultyLevel, explanation } = req.body;
            const question = this.questionRepository.create({
                text,
                options,
                correctAnswer,
                topic,
                difficultyLevel,
                explanation
            });
            await this.questionRepository.save(question);
            res.status(201).json({
                message: 'Question created successfully',
                question
            });
        }
        catch (error) {
            console.error('Create question error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getQuestionsForSession(req, res) {
        try {
            const { difficultyLevel, count = 10 } = req.query;
            const questions = await this.adaptiveService.getQuestionsForSession(Number(difficultyLevel), Number(count));
            // Remove correct answers from response for security
            const questionsForQuiz = questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                topic: q.topic,
                difficultyLevel: q.difficultyLevel
            }));
            res.json(questionsForQuiz);
        }
        catch (error) {
            console.error('Get questions for session error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.QuestionController = QuestionController;
