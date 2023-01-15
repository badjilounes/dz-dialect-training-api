import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { SearchChapterQueryResult } from '@business/professor/domain/queries/search-chapter/search-chapter.query';
import { ChapterQueryRepository } from '@business/professor/domain/repositories/chapter-query-repository';
import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class ChapterTypeormQueryRepository extends BaseTypeormQueryRepository implements ChapterQueryRepository {
  constructor(
    @InjectRepository(Chapter)
    protected readonly chapterRepository: Repository<Chapter>,

    protected readonly context: AppContextService,
  ) {
    super(context);
  }

  async searchChapter(pageIndex: number, pageSize: number, query = ''): Promise<SearchChapterQueryResult> {
    const options: FindManyOptions<Chapter> = {
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [{ name: ILike(`%${query}%`) }, { description: ILike(`%${query}%`) }];
    }

    const [elements, length] = await this.chapterRepository.findAndCount(options);

    return {
      elements,
      length,
      pageIndex,
      pageSize,
    };
  }
}
