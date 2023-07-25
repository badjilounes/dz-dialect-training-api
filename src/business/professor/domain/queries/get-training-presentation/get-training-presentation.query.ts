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

export type TrainingPresentationQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: TrainingCourseQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetTrainingPresentationQueryResult = TrainingPresentationQueryResult | null;

export class GetTrainingPresentationQuery extends Query<GetTrainingPresentationQueryResult> {
  constructor() {
    super();
  }
}
