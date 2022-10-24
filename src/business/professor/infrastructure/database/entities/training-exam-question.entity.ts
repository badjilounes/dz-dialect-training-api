import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainingExam } from './training-exam.entity';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';

@Entity()
export class TrainingExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  order!: number;

  @Column({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @Column()
  question!: string;

  @Column('text', { array: true })
  answer!: string[];

  @Column('text', { array: true })
  propositions!: string[];

  @ManyToOne(() => TrainingExam, { onDelete: 'CASCADE' })
  @JoinColumn()
  exam!: TrainingExam;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
