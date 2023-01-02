import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';

type ExamQuestion = {
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

export type Training = {
  id: string;
  chapterId?: string;
  exams: Exam[];
};

export interface TrainingQueryRepository {
  findTrainingById(id: string): Promise<Training | undefined>;
  findExamById(examId: string): Promise<Exam | undefined>;
}
