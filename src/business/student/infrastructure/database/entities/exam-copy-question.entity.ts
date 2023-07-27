import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { QuestionTypeEnum } from '../../../domain/enums/question-type.enum';

import { ExamCopyQuestionResponse } from './exam-copy-question-response.entity';
import { ExamCopy } from './exam-copy.entity';

@Entity({ orderBy: { order: 'ASC' } })
export class ExamCopyQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  examQuestionId!: string;

  @ManyToOne(() => ExamCopy, { onDelete: 'CASCADE' })
  @JoinColumn()
  examCopy!: ExamCopy;

  @OneToOne(() => ExamCopyQuestionResponse, { eager: true, cascade: true })
  @JoinColumn()
  response!: ExamCopyQuestionResponse | null;

  @Column({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @Column()
  question!: string;

  @Column('text', { array: true })
  answer!: string[];

  @Column('text', { array: true })
  propositions!: string[];

  @Column()
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
