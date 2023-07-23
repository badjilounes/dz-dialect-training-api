import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchTrainingQuery, SearchTrainingQueryResult } from './search-training.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchTrainingQuery)
export class SearchTrainingQueryHandler implements IQueryHandler<SearchTrainingQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  async execute(query: SearchTrainingQuery): Promise<SearchTrainingQueryResult> {
    return this.trainingQueryRepository.searchTraining(query.pageIndex, query.pageSize, query.search);
  }
}
