import { DataSource } from 'typeorm';
import { User, Question, Session, UserProgress } from '../models';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './database/learning_platform.db',
  synchronize: true, // Auto-create tables in development
  logging: false,
  entities: [User, Question, Session, UserProgress],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};
