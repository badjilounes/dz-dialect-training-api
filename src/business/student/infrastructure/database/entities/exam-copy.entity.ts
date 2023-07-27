import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ExamCopyQuestion } from './exam-copy-question.entity';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';

@Index(['examId', 'userId'])
@Entity({ orderBy: { updatedAt: 'DESC' } })
export class ExamCopy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  examId!: string;

  @Column({ type: 'enum', enum: ExamCopyStateEnum, default: ExamCopyStateEnum.IN_PROGRESS })
  state!: ExamCopyStateEnum;

  @OneToMany(() => ExamCopyQuestion, (question) => question.examCopy, { eager: true, cascade: true })
  questions!: ExamCopyQuestion[];

  @Column()
  currentQuestionIndex!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
