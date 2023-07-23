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

import { TrainingCourse } from './training-course.entity';
import { TrainingExamQuestion } from './training-exam-question.entity';

@Entity()
export class TrainingExam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => TrainingExamQuestion, (step) => step.exam, { eager: true, cascade: true })
  questions!: TrainingExamQuestion[];

  @ManyToOne(() => TrainingCourse, { onDelete: 'CASCADE' })
  @JoinColumn()
  course!: TrainingCourse;

  @Column({ generated: 'increment', default: 1 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
