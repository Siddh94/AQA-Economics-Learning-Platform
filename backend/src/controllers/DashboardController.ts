import { Response } from 'express';
import { AppDataSource } from '../utils/database';
import { User } from '../models';
import { AdaptiveService } from '../services/AdaptiveService';
import { AuthRequest } from '../utils/auth';

export class DashboardController {
  private userRepository = AppDataSource.getRepository(User);
  private adaptiveService = new AdaptiveService();

  async getDashboardData(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      // Get user info
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get recent session scores
      const recentScores = await this.adaptiveService.getRecentSessionScores(userId);

      // Get weakest topics
      const weakestTopics = await this.adaptiveService.getWeakestTopics(userId);

      // Calculate overall stats
      const totalSessions = recentScores.length;
      const averageScore = totalSessions > 0 
        ? recentScores.reduce((sum, score) => sum + score, 0) / totalSessions 
        : 0;

      // Difficulty level labels
      const difficultyLabels = {
        1: 'Beginner',
        2: 'Intermediate', 
        3: 'Advanced'
      };

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        proficiencyLevel: {
          level: user.currentDifficultyLevel,
          label: difficultyLabels[user.currentDifficultyLevel as keyof typeof difficultyLabels]
        },
        stats: {
          totalSessions,
          averageScore: Math.round(averageScore * 100) / 100,
          recentScores
        },
        weakestTopics: weakestTopics.map(topic => ({
          topic: topic.topic,
          accuracy: Math.round(topic.accuracy * 100) / 100,
          totalAttempts: topic.totalAnswers,
          correctAnswers: topic.correctAnswers
        })),
        trends: {
          scoreHistory: recentScores
        }
      });
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProgressAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      // Get all user progress
      const progressRepository = AppDataSource.getRepository('UserProgress');
      const allProgress = await progressRepository
        .createQueryBuilder('progress')
        .where('progress.userId = :userId', { userId })
        .orderBy('progress.accuracy', 'ASC')
        .getMany();

      // Get recent sessions for trend analysis
      const recentScores = await this.adaptiveService.getRecentSessionScores(userId, 20);

      res.json({
        topicProgress: allProgress.map(p => ({
          topic: p.topic,
          accuracy: Math.round(p.accuracy * 100) / 100,
          totalAttempts: p.totalAnswers,
          correctAnswers: p.correctAnswers,
          lastUpdated: p.lastUpdated
        })),
        sessionTrends: recentScores,
        summary: {
          totalTopicsStudied: allProgress.length,
          overallAccuracy: allProgress.length > 0 
            ? Math.round(allProgress.reduce((sum, p) => sum + p.accuracy, 0) / allProgress.length * 100) / 100
            : 0,
          totalQuestionsSeen: allProgress.reduce((sum, p) => sum + p.totalAnswers, 0),
          totalCorrectAnswers: allProgress.reduce((sum, p) => sum + p.correctAnswers, 0)
        }
      });
    } catch (error) {
      console.error('Get progress analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
