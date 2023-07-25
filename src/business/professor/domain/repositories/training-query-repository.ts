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

type Exam = {
  id: string;
  name: string;
  questions: ExamQuestion[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type Course = {
  id: string;
  name: string;
  description: string;
  exams: Exam[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type Training = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: Course[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedResult<T> = {
  elements: T[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export interface TrainingQueryRepository {
  searchTraining(pageIndex: number, pageSize: number, search?: string): Promise<PaginatedResult<Training>>;
  searchCourse(
    trainingId: string,
    pageIndex: number,
    pageSize: number,
    search?: string,
  ): Promise<PaginatedResult<Course>>;
  searchExam(coourseId: string, pageIndex: number, pageSize: number, search?: string): Promise<PaginatedResult<Exam>>;
}
