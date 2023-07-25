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

export type GetExamByIdQueryResult = TrainingCourseExamQueryResult | null;

export class GetExamByIdQuery extends Query<GetExamByIdQueryResult> {
  constructor(public readonly trainingId: string, public readonly courseId: string, public readonly examId: string) {
    super();
  }
}
