import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';

type ExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  answer: string[];
  order: number;
  propositions: string[];
};

type Exam = {
  id: string;
  name: string;
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
