import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, Min, Max } from 'class-validator';
import { User } from './User';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('simple-json')
  questions: string[]; // Array of question IDs

  @Column('simple-json')
  answers: number[]; // User's answers (indices)

  @Column('decimal', { precision: 5, scale: 2 })
  @Min(0)
  @Max(100)
  score: number; // Percentage score

  @Column()
  difficultyLevel: number; // Difficulty level of this session

  @Column()
  timeSpent: number; // In seconds

  @CreateDateColumn()
  completedAt: Date;
}
