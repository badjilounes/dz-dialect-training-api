import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainingExamQuestion } from 'business/training/infrastructure/database/entities/training-exam-question.entity';

@Entity()
export class TrainingExamResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  response!: string;

  @Column()
  valid!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => TrainingExamQuestion, { onDelete: 'CASCADE' })
  @JoinColumn()
  question!: TrainingExamQuestion;
}
