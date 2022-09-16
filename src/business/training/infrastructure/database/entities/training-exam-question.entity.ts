import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainingExam } from './training-exam.entity';

import { TrainingExamResponse } from 'business/training/infrastructure/database/entities/training-exam-response.entity';

@Entity()
export class TrainingExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  order!: number;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @Column('text', { array: true })
  propositions!: string[];

  @ManyToOne(() => TrainingExam, { onDelete: 'CASCADE' })
  @JoinColumn()
  exam!: TrainingExam;

  @OneToMany(() => TrainingExamResponse, (response) => response.question, { eager: true, cascade: true })
  @JoinColumn()
  responses!: TrainingExamResponse[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
