import { Inject } from '@nestjs/common';

import { ExamQueryRepository } from '../../repositories/exam-query-repository';
import { EXAM_QUERY_REPOSITORY } from '../../repositories/tokens';

import { SearchExamQuery, SearchExamQueryResult } from './search-exam.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchExamQuery)
export class SearchExamQueryHandler implements IQueryHandler<SearchExamQuery> {
  constructor(
    @Inject(EXAM_QUERY_REPOSITORY)
    private readonly courseQueryRepository: ExamQueryRepository,
  ) {}

  execute(query: SearchExamQuery): Promise<SearchExamQueryResult> {
    return this.courseQueryRepository.searchExam(query.courseId, query.pageIndex, query.pageSize, query.search);
  }
}
