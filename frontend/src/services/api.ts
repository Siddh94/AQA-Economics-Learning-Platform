import axios, { AxiosResponse } from 'axios';
import { User, AuthResponse, DashboardData, QuizSession, QuizResult, Question, Session } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/profile');
    return response.data;
  },
};

export const questionsAPI = {
  getTopics: async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await api.get('/questions/topics');
    return response.data;
  },

  getQuestions: async (params?: {
    difficulty?: number;
    topic?: string;
    limit?: number;
  }): Promise<Question[]> => {
    const response: AxiosResponse<Question[]> = await api.get('/questions', { params });
    return response.data;
  },

  createQuestion: async (questionData: {
    text: string;
    options: string[];
    correctAnswer: number;
    topic: string;
    difficultyLevel: number;
    explanation?: string;
  }): Promise<Question> => {
    const response: AxiosResponse<{ question: Question }> = await api.post('/questions', questionData);
    return response.data.question;
  },
};

export const sessionsAPI = {
  createSession: async (): Promise<QuizSession> => {
    const response: AxiosResponse<QuizSession> = await api.post('/sessions');
    return response.data;
  },

  submitSession: async (sessionId: string, data: {
    answers: number[];
    timeSpent: number;
  }): Promise<QuizResult> => {
    const response: AxiosResponse<QuizResult> = await api.put(`/sessions/${sessionId}`, data);
    return response.data;
  },

  getUserSessions: async (limit?: number): Promise<Session[]> => {
    const response: AxiosResponse<Session[]> = await api.get('/sessions/user', {
      params: { limit },
    });
    return response.data;
  },
};

export const dashboardAPI = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response: AxiosResponse<DashboardData> = await api.get('/dashboard');
    return response.data;
  },

  getProgressAnalytics: async (): Promise<any> => {
    const response: AxiosResponse<any> = await api.get('/dashboard/analytics');
    return response.data;
  },
};

export default api;
