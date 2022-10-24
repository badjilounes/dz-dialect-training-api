import { Query } from '@cqrs/query';

export type GetExamPresentationResultQueryResult = {
  note: number;
  total: number;
};

export class GetExamPresentationResultQuery extends Query<GetExamPresentationResultQueryResult> {}
