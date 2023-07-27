import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ExamCopyQuestion } from './exam-copy-question.entity';

@Entity()
export class ExamCopyQuestionResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { array: true })
  response!: string[];

  @Column()
  valid!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => ExamCopyQuestion, (examCopyQuestion) => examCopyQuestion.response)
  @JoinColumn()
  examCopyQuestion!: ExamCopyQuestion;
}
