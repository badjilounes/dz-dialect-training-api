import { ChapterAggregate } from '../aggregates/chapter.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface ChapterCommandRepository extends IBaseCommandRepository<ChapterAggregate> {
  findChapterByName(name: string): Promise<ChapterAggregate | undefined>;
}
