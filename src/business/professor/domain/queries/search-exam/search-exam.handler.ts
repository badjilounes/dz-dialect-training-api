import { Inject } from '@nestjs/common';

import { TRAINING_QUERY_REPOSITORY } from '../../repositories/tokens';
import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchExamQuery, SearchExamQueryResult } from './search-exam.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchExamQuery)
export class SearchExamQueryHandler implements IQueryHandler<SearchExamQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute(query: SearchExamQuery): Promise<SearchExamQueryResult> {
    return this.trainingQueryRepository.searchExam(query.courseId, query.pageIndex, query.pageSize, query.search);
  }
}
