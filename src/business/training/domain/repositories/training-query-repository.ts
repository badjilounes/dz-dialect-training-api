import { ExamTypeEnum } from 'business/training/domain/enums/exam-type.enum';

type ExamQuestion = {
  id: string;
  question: string;
  answer: string;
  propositions: string[];
};

type Exam = {
  id: string;
  name: string;
  type: ExamTypeEnum;
  questions: ExamQuestion[];
};

export type Training = {
  id: string;
  category: string;
  exams: Exam[];
};

export interface TrainingQueryRepository {
  findPresentation(): Promise<Training | undefined>;
}
