import { QuestionTypeEnum } from '../enums/question-type.enum';

type ExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  propositions: string[];
  answer: string[];
};

export type Exam = {
  id: string;
  name: string;
  questions: ExamQuestion[];
  order: number;
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
