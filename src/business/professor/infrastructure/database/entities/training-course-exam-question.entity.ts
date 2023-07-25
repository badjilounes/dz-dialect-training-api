import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainingCourseExam } from './training-course-exam.entity';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';

@Entity()
export class TrainingCourseExamQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @Column()
  question!: string;

  @Column('text', { array: true })
  answer!: string[];

  @Column('text', { array: true })
  propositions!: string[];

  @ManyToOne(() => TrainingCourseExam, { onDelete: 'CASCADE' })
  @JoinColumn()
  exam!: TrainingCourseExam;

  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
