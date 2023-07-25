import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingPresentationQuery, GetTrainingPresentationQueryResult } from './get-training-presentation.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetTrainingPresentationQuery)
export class GetTrainingPresentationQueryHandler implements IQueryHandler<GetTrainingPresentationQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute(): Promise<GetTrainingPresentationQueryResult> {
    return this.trainingQueryRepository.getTrainingPresentation();
  }
}
