import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, Min, Max } from 'class-validator';
import { User } from './User';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.progress)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @IsNotEmpty()
  topic: string;

  @Column({ default: 0 })
  @Min(0)
  correctAnswers: number;

  @Column({ default: 0 })
  @Min(0)
  totalAnswers: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  @Min(0)
  @Max(100)
  accuracy: number; // Percentage

  @UpdateDateColumn()
  lastUpdated: Date;
}
