import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetExamByIdQuery, GetExamByIdQueryResult } from './get-exam-by-id.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamByIdQuery)
export class GetExamByIdQueryHandler implements IQueryHandler<GetExamByIdQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute({ examId }: GetExamByIdQuery): Promise<GetExamByIdQueryResult> {
    return this.trainingQueryRepository.getTrainingCourseExamById(examId);
  }
}
