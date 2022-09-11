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

import { TrainingExamTypeEnum } from '../../domain/enums/training-exam-type.enum';

import { TrainingExamQuestion } from './training-exam-question.entity';
import { Training } from './training.entity';

@Entity()
export class TrainingExam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ enum: ['TRANSLATION'] })
  type!: TrainingExamTypeEnum;

  @OneToMany(() => TrainingExamQuestion, (step) => step.exam, { eager: true, cascade: true })
  questions!: TrainingExamQuestion[];

  @ManyToOne(() => Training)
  @JoinColumn()
  training!: Training;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
