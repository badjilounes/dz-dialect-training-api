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

import { TrainingCourseExam } from './training-course-exam.entity';
import { Training } from './training.entity';

@Entity({ orderBy: { order: 'ASC' } })
export class TrainingCourse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ default: '' })
  color!: string;

  @ManyToOne(() => Training, { onDelete: 'CASCADE' })
  @JoinColumn()
  training!: TrainingCourse;

  @OneToMany(() => TrainingCourseExam, (step) => step.course, { eager: true, cascade: true })
  exams!: TrainingCourseExam[];

  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
