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

import { TrainingExamQuestion } from './training-exam-question.entity';
import { Training } from './training.entity';

import { ExamTypeEnum } from 'business/training/domain/enums/exam-type.enum';

@Entity()
export class TrainingExam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  order!: number;

  @Column()
  name!: string;

  @Column({ enum: ExamTypeEnum })
  type!: ExamTypeEnum;

  @OneToMany(() => TrainingExamQuestion, (step) => step.exam, { eager: true, cascade: true })
  questions!: TrainingExamQuestion[];

  @ManyToOne(() => Training, { onDelete: 'CASCADE' })
  @JoinColumn()
  training!: Training;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
