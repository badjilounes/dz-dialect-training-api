import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { TrainingExamQuestion } from '@business/student/infrastructure/database/entities/training-exam-question.entity';

@Entity()
export class ExamCopyResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { array: true })
  response!: string[];

  @Column()
  valid!: boolean;

  @ManyToOne(() => ExamCopy, { onDelete: 'CASCADE' })
  examCopy!: ExamCopy;

  @ManyToOne(() => TrainingExamQuestion, { onDelete: 'CASCADE' })
  question!: TrainingExamQuestion;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
