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
import { Training } from './training.entity';

@Entity()
export class TrainingCourse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(() => Training, { onDelete: 'CASCADE' })
  @JoinColumn()
  training!: TrainingCourse;

  @OneToMany(() => TrainingExam, (step) => step.course, { eager: true, cascade: true })
  exams!: TrainingExam[];

  @Column({ generated: 'increment', default: 1 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
