import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';

export type ExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  answer: string[];
  order: number;
  propositions: string[];
};

export type Exam = {
  id: string;
  name: string;
  questions: ExamQuestion[];
};

export type Chapter = {
  id: string;
  name: string;
  description: string;
  order: number;
};

export type Training = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;

  courses: {
    id: string;
    name: string;
    description: string;
    exams: Exam[];
  }[];

  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface TrainingQueryRepository {
  findTrainingById(id: string): Promise<Training | undefined>;
  findExamById(examId: string): Promise<Exam | undefined>;
  findTrainingList(): Promise<Training[]>;
}
