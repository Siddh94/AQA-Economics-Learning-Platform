export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currentDifficultyLevel: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  topic: string;
  difficultyLevel: number;
  correctAnswer?: number; // Only available after submission
  explanation?: string;
}

export interface Session {
  id: string;
  userId: string;
  questions: string[];
  answers: number[];
  score: number;
  difficultyLevel: number;
  timeSpent: number;
  completedAt: string;
}

export interface UserProgress {
  topic: string;
  accuracy: number;
  totalAttempts: number;
  correctAnswers: number;
  lastUpdated: string;
}

export interface DashboardData {
  user: User;
  proficiencyLevel: {
    level: number;
    label: string;
  };
  stats: {
    totalSessions: number;
    averageScore: number;
    recentScores: number[];
  };
  weakestTopics: UserProgress[];
  trends: {
    scoreHistory: number[];
  };
}

export interface QuizSession {
  sessionId: string;
  questions: Question[];
  difficultyLevel: number;
}

export interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  oldDifficultyLevel: number;
  newDifficultyLevel: number;
  results: Array<{
    questionId: string;
    question: string;
    options: string[];
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    topic: string;
    explanation?: string;
  }>;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
