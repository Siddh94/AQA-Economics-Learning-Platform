import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsIn, Min, Max } from 'class-validator';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @IsNotEmpty()
  text: string;

  @Column('simple-json')
  options: string[]; // Array of 4 options

  @Column()
  @Min(0)
  @Max(3)
  correctAnswer: number; // Index of correct option (0-3)

  @Column()
  @IsNotEmpty()
  topic: string; // e.g., "Market Failure", "Fiscal Policy"

  @Column()
  @IsIn([1, 2, 3])
  difficultyLevel: number; // 1-3

  @Column('text', { nullable: true })
  explanation?: string;

  @CreateDateColumn()
  createdAt: Date;
}
