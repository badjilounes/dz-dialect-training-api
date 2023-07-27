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
  description: string;
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
  getTrainingCourseExamById(trainingId: string, courseId: string, examId: string): Promise<Exam | null>;
  getTrainingPresentation(): Promise<Training | null>;
  getTrainingById(trainingid: string): Promise<Training | null>;
  getTrainingList(): Promise<Training[]>;
  searchTraining(pageIndex: number, pageSize: number, search?: string): Promise<PaginatedResult<Training>>;
  searchCourse(
    trainingId: string,
    pageIndex: number,
    pageSize: number,
    search?: string,
  ): Promise<PaginatedResult<Course>>;
  searchExam(coourseId: string, pageIndex: number, pageSize: number, search?: string): Promise<PaginatedResult<Exam>>;
}
