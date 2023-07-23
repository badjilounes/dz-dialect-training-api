import { Inject } from '@nestjs/common';

import { SearchCourseQuery, SearchCourseQueryResult } from './search-course.query';

import { CourseQueryRepository } from '@business/professor/domain/repositories/course-query-repository';
import { COURSE_QUERY_REPOSITORY } from '@business/professor/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchCourseQuery)
export class SearchCourseQueryHandler implements IQueryHandler<SearchCourseQuery> {
  constructor(
    @Inject(COURSE_QUERY_REPOSITORY)
    private readonly courseQueryRepository: CourseQueryRepository,
  ) {}

  execute(query: SearchCourseQuery): Promise<SearchCourseQueryResult> {
    return this.courseQueryRepository.searchCourse(query.trainingId, query.pageIndex, query.pageSize, query.search);
  }
}
