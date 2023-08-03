import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

export type GetExerciseListExamQuestionQueryResult = {
  id: string;
  examId: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  propositions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type GetExerciseListExamQueryResult = {
  id: string;
  courseId: string;
  name: string;
  description: string;
  questions: GetExerciseListExamQuestionQueryResult[];
  current?: {
    questionIndex: number;
    questionLength: number;
  };
  result?: {
    score: number;
    maxScore: number;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetExerciseListCourseQueryResult = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  color: string;
  exams: GetExerciseListExamQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetExerciseListTrainingQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: GetExerciseListCourseQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetExerciseListQueryResult = GetExerciseListTrainingQueryResult[];
export class GetExerciseListQuery extends Query<GetExerciseListQueryResult> {
  constructor() {
    super();
  }
}
