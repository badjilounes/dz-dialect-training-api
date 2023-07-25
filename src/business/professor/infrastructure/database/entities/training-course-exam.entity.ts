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

import { TrainingCourseExamQuestion } from './training-course-exam-question.entity';
import { TrainingCourse } from './training-course.entity';

@Entity()
export class TrainingCourseExam {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => TrainingCourseExamQuestion, (step) => step.exam, { eager: true, cascade: true })
  questions!: TrainingCourseExamQuestion[];

  @ManyToOne(() => TrainingCourse, { onDelete: 'CASCADE' })
  @JoinColumn()
  course!: TrainingCourse;

  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
