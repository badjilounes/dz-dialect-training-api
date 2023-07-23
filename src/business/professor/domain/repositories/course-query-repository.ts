import { QuestionTypeEnum } from '../enums/question-type.enum';

type ExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

export type Exam = {
  id: string;
  name: string;
  questions: ExamQuestion[];
};

type Course = {
  id: string;
  name: string;
  description: string;
  exams: Exam[];
};

type CoursePaginatedResult = {
  elements: Course[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export interface CourseQueryRepository {
  searchCourse(
    trainingId: string,
    pageIndex: number,
    pageSize: number,
    search?: string,
  ): Promise<CoursePaginatedResult>;
}
