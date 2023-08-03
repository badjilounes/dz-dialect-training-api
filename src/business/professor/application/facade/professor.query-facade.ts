import { QuestionTypeEnum } from '../../domain/enums/question-type.enum';

export type ExamQuestionFacadeResponse = {
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

export type ExamFacadeResponse = {
  id: string;
  courseId: string;
  name: string;
  description: string;
  questions: ExamQuestionFacadeResponse[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseFacadeResponse = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  color: string;
  exams: ExamFacadeResponse[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingFacadeResponse = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: CourseFacadeResponse[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingListFilter = {
  isPresentation: boolean;
};

export interface ProfessorQueryFacade {
  getTrainingList(filter?: TrainingListFilter): Promise<TrainingFacadeResponse[]>;
  getTrainingById(trainingId: string): Promise<TrainingFacadeResponse>;
  getTrainingPresentation(): Promise<TrainingFacadeResponse>;
  getExamById(trainingId: string, courseId: string, examId: string): Promise<ExamFacadeResponse>;
}
