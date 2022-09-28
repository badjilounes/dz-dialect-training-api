import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ExamCopyStateEnum } from '@business/training/domain/enums/exam-copy-state.enum';
import { TrainingExam } from '@business/training/infrastructure/database/entities/training-exam.entity';
import { ExamCopyResponse } from 'business/training/infrastructure/database/entities/exam-copy-response.entity';

@Index(['exam.id', 'userId'])
@Entity()
export class ExamCopy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: ExamCopyStateEnum })
  state!: ExamCopyStateEnum;

  @ManyToOne(() => TrainingExam, { onDelete: 'CASCADE' })
  exam!: TrainingExam;

  @OneToMany(() => ExamCopyResponse, (response) => response.examCopy, { eager: true, cascade: true })
  responses!: ExamCopyResponse[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
