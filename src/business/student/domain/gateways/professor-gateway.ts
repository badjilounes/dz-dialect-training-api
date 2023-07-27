import { QuestionTypeEnum } from '../enums/question-type.enum';

export type ExamQuestion = {
  id: string;
  examId: string;
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
  courseId: string;
  name: string;
  description: string;
  questions: ExamQuestion[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Course = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  exams: Exam[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Training = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: Course[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface ProfessorGateway {
  getTraingList(): Promise<Training[]>;
  getTrainingById(trainingId: string): Promise<Training | null>;
  getTrainingPresentation(): Promise<Training | null>;
  getExamById(trainingId: string, courseId: string, examId: string): Promise<Exam | null>;
}
