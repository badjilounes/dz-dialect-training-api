import { Inject } from '@nestjs/common';

import { SearchChapterQuery, SearchChapterQueryResult } from './search-chapter.query';

import { ChapterQueryRepository } from '@business/professor/domain/repositories/chapter-query-repository';
import { CHAPTER_QUERY_REPOSITORY } from '@business/professor/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(SearchChapterQuery)
export class SearchChapterQueryHandler implements IQueryHandler<SearchChapterQuery> {
  constructor(
    @Inject(CHAPTER_QUERY_REPOSITORY)
    private readonly chapterQueryRepository: ChapterQueryRepository,
  ) {}

  async execute(query: SearchChapterQuery): Promise<SearchChapterQueryResult> {
    return this.chapterQueryRepository.searchChapter(query.pageIndex, query.pageSize, query.search);
  }
}
