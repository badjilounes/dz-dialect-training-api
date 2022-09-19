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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
