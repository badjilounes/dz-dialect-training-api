import { Query } from '@cqrs/query';

type TrainingQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  courses: {
    id: string;
    name: string;
    description: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
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
