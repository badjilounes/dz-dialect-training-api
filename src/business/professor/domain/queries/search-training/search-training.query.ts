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
  description: string;
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

export type TrainingQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: TrainingCourseQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchTrainingQueryResult = {
  elements: TrainingQueryResult[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export class SearchTrainingQuery extends Query<SearchTrainingQueryResult> {
  constructor(public readonly pageIndex: number, public readonly pageSize: number, public readonly search?: string) {
    super();
  }
}
