import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingByIdQuery, GetTrainingByIdQueryResult } from './get-training-by-id.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetTrainingByIdQuery)
export class GetTrainingByIdQueryHandler implements IQueryHandler<GetTrainingByIdQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute({ trainingId }: GetTrainingByIdQuery): Promise<GetTrainingByIdQueryResult> {
    return this.trainingQueryRepository.getTrainingById(trainingId);
  }
}
