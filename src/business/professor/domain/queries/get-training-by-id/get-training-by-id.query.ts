import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Query } from '@cqrs/query';

type TrainingCourseExamQuestionQueryResult = {
  id: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  propositions: string[];
  answer: string[];
  createdAt: Date;
  updatedAt: Date;
};

type TrainingCourseExamQueryResult = {
  id: string;
  name: string;
  questions: TrainingCourseExamQuestionQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type TrainingCourseQueryResult = {
  id: string;
  name: string;
  description: string;
  exams: TrainingCourseExamQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainingByIdQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: TrainingCourseQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetTrainingByIdQueryResult = TrainingByIdQueryResult | null;

export class GetTrainingByIdQuery extends Query<GetTrainingByIdQueryResult> {
  constructor(public readonly trainingId: string) {
    super();
  }
}
