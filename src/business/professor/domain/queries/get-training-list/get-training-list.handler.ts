import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingListQuery, GetTrainingListQueryResult } from './get-training-list.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetTrainingListQuery)
export class GetTrainingListQueryHandler implements IQueryHandler<GetTrainingListQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute(): Promise<GetTrainingListQueryResult> {
    return this.trainingQueryRepository.getTrainingList();
  }
}
