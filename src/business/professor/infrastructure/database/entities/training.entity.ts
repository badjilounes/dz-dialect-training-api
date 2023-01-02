import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainingExam } from './training-exam.entity';

import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Chapter, { eager: true })
  @JoinColumn()
  chapter!: Chapter | null;

  @Column()
  learningLanguage!: string;

  @Column()
  fromLanguage!: string;

  @OneToMany(() => TrainingExam, (step) => step.training, { eager: true, cascade: true })
  exams!: TrainingExam[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
