import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

type ExamQuestionQueryResult = {
  id: string;
  order: number;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
  answer: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ExamQueryResult = {
  id: string;
  name: string;
  questions: ExamQuestionQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchExamQueryResult = {
  elements: ExamQueryResult[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export class SearchExamQuery extends Query<SearchExamQueryResult> {
  constructor(
    public readonly courseId: string,
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly search?: string,
  ) {
    super();
  }
}
