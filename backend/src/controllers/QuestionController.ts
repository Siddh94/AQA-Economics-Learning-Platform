import { Request, Response } from 'express';
import { AppDataSource } from '../utils/database';
import { Question } from '../models/Question';
import { AdaptiveService } from '../services/AdaptiveService';
import { AuthRequest } from '../utils/auth';

export class QuestionController {
  private questionRepository = AppDataSource.getRepository(Question);
  private adaptiveService = new AdaptiveService();

  async getQuestions(req: AuthRequest, res: Response) {
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
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTopics(req: Request, res: Response) {
    try {
      const topics = await this.questionRepository
        .createQueryBuilder('question')
        .select('DISTINCT question.topic', 'topic')
        .getRawMany();

      res.json(topics.map(t => t.topic));
    } catch (error) {
      console.error('Get topics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createQuestion(req: Request, res: Response) {
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
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getQuestionsForSession(req: AuthRequest, res: Response) {
    try {
      const { difficultyLevel, count = 10 } = req.query;
      
      const questions = await this.adaptiveService.getQuestionsForSession(
        Number(difficultyLevel), 
        Number(count)
      );

      // Remove correct answers from response for security
      const questionsForQuiz = questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        topic: q.topic,
        difficultyLevel: q.difficultyLevel
      }));

      res.json(questionsForQuiz);
    } catch (error) {
      console.error('Get questions for session error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
