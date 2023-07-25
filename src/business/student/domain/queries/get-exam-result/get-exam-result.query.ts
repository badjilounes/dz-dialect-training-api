import { Query } from '@cqrs/query';

export type GetExamResultQueryResult = {
  note: number;
  total: number;
};

export type GetExamResultQueryPayload = {
  trainingId: string;
  courseId: string;
  examId: string;
};

export class GetExamResultQuery extends Query<GetExamResultQueryResult> {
  constructor(public readonly payload: GetExamResultQueryPayload) {
    super();
  }
}
