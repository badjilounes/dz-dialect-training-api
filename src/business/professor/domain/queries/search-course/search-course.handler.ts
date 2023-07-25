import { Inject } from '@nestjs/common';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchCourseQuery, SearchCourseQueryResult } from './search-course.query';

import { TRAINING_QUERY_REPOSITORY } from '@business/professor/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchCourseQuery)
export class SearchCourseQueryHandler implements IQueryHandler<SearchCourseQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  execute(query: SearchCourseQuery): Promise<SearchCourseQueryResult> {
    return this.trainingQueryRepository.searchCourse(query.trainingId, query.pageIndex, query.pageSize, query.search);
  }
}
