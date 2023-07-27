import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

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
  currentQuestionIndex: number;
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

export type GetExerciseListQueryResult = Course[];

export class GetExerciseListQuery extends Query<GetExerciseListQueryResult> {
  constructor() {
    super();
  }
}
