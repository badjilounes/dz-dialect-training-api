import { QuestionTypeEnum } from '../enums/question-type.enum';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';

export type ExamCopyQuestionResponse = {
  id: string;
  valid: boolean;
  value: string;
  createdAt: Date;
};

export type ExamCopyQuestion = {
  id: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  answer: string;
  propositions: string[];
  response: ExamCopyQuestionResponse | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type ExamCopy = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  currentQuestionIndex: number;
  questions: ExamCopyQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export interface ExamCopyQueryRepository {
  getNextExamCopy(examIdList: string[]): Promise<ExamCopy | undefined>;
  findExamCopyList(): Promise<ExamCopy[]>;
  findExamCopyByExamId(examId: string): Promise<ExamCopy | undefined>;
}
