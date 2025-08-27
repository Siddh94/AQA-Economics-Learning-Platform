import { AppDataSource } from '../utils/database';
import { User, Question, Session, UserProgress } from '../models';

export class AdaptiveService {
  private userRepository = AppDataSource.getRepository(User);
  private questionRepository = AppDataSource.getRepository(Question);
  private sessionRepository = AppDataSource.getRepository(Session);
  private progressRepository = AppDataSource.getRepository(UserProgress);

  /**
   * Calculate new difficulty level based on session score
   */
  calculateNewDifficultyLevel(currentLevel: number, score: number): number {
    if (score >= 80) {
      return Math.min(currentLevel + 1, 3); // Max level 3
    } else if (score <= 40) {
      return Math.max(currentLevel - 1, 1); // Min level 1
    }
    return currentLevel; // Stay at current level
  }

  /**
   * Get questions for a quiz session based on difficulty level
   */
  async getQuestionsForSession(difficultyLevel: number, count: number = 10): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.difficultyLevel = :level', { level: difficultyLevel })
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();

    if (questions.length < count) {
      // If not enough questions at this level, get from adjacent levels
      const additionalQuestions = await this.questionRepository
        .createQueryBuilder('question')
        .where('question.difficultyLevel IN (:...levels)', { 
          levels: difficultyLevel === 1 ? [2] : difficultyLevel === 3 ? [2] : [1, 3] 
        })
        .orderBy('RANDOM()')
        .limit(count - questions.length)
        .getMany();

      questions.push(...additionalQuestions);
    }

    return questions.slice(0, count);
  }

  /**
   * Calculate score for a session
   */
  calculateScore(answers: number[], questions: Question[]): number {
    let correct = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        correct++;
      }
    }
    return (correct / answers.length) * 100;
  }

  /**
   * Update user progress after completing a session
   */
  async updateUserProgress(userId: string, questions: Question[], answers: number[]): Promise<void> {
    const topicStats: { [topic: string]: { correct: number; total: number } } = {};

    // Calculate stats per topic
    questions.forEach((question, index) => {
      const topic = question.topic;
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].total++;
      if (answers[index] === question.correctAnswer) {
        topicStats[topic].correct++;
      }
    });

    // Update or create progress records
    for (const [topic, stats] of Object.entries(topicStats)) {
      let progress = await this.progressRepository.findOne({
        where: { userId, topic }
      });

      if (progress) {
        progress.correctAnswers += stats.correct;
        progress.totalAnswers += stats.total;
        progress.accuracy = (progress.correctAnswers / progress.totalAnswers) * 100;
      } else {
        progress = this.progressRepository.create({
          userId,
          topic,
          correctAnswers: stats.correct,
          totalAnswers: stats.total,
          accuracy: (stats.correct / stats.total) * 100
        });
      }

      await this.progressRepository.save(progress);
    }
  }

  /**
   * Get user's weakest topics (top 3)
   */
  async getWeakestTopics(userId: string): Promise<UserProgress[]> {
    return await this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId })
      .andWhere('progress.totalAnswers >= :minAnswers', { minAnswers: 3 }) // At least 3 attempts
      .orderBy('progress.accuracy', 'ASC')
      .limit(3)
      .getMany();
  }

  /**
   * Get user's recent session scores for trend analysis
   */
  async getRecentSessionScores(userId: string, limit: number = 10): Promise<number[]> {
    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .orderBy('session.completedAt', 'DESC')
      .limit(limit)
      .getMany();

    return sessions.map(session => session.score).reverse(); // Chronological order
  }

  /**
   * Update user's difficulty level after session completion
   */
  async updateUserDifficultyLevel(userId: string, newLevel: number): Promise<void> {
    await this.userRepository.update(userId, { currentDifficultyLevel: newLevel });
  }
}
