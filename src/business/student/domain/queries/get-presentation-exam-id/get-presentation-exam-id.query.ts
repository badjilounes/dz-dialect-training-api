import { Query } from '@cqrs/query';

export type GetPresentationExamIdQueryResult = {
  examId: string;
};

export class GetPresentationExamIdQuery extends Query<GetPresentationExamIdQueryResult> {
  constructor() {
    super();
  }
}
