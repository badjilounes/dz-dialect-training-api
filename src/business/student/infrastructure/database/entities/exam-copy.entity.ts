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

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyResponse } from '@business/student/infrastructure/database/entities/exam-copy-response.entity';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';

@Index(['exam.id', 'userId'])
@Entity()
export class ExamCopy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: ExamCopyStateEnum, default: ExamCopyStateEnum.IN_PROGRESS })
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
