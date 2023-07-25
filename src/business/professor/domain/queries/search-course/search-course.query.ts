import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

type GetExamExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
  answer: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetExamQueryResult = {
  id: string;
  name: string;
  questions: GetExamExamQuestion[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type CourseQueryResult = {
  id: string;
  name: string;
  description: string;
  exams: GetExamQueryResult[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchCourseQueryResult = {
  elements: CourseQueryResult[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export class SearchCourseQuery extends Query<SearchCourseQueryResult> {
  constructor(
    public readonly trainingId: string,
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly search?: string,
  ) {
    super();
  }
}
