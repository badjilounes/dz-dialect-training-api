import { QuestionTypeEnum } from '../enums/question-type.enum';

type ExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  propositions: string[];
  answer: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Exam = {
  id: string;
  name: string;
  questions: ExamQuestion[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type ExamPaginatedResult = {
  elements: Exam[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export interface ExamQueryRepository {
  searchExam(coourseId: string, pageIndex: number, pageSize: number, search?: string): Promise<ExamPaginatedResult>;
}
