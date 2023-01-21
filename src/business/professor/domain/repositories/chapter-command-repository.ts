import { ChapterAggregate } from '../aggregates/chapter.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface ChapterCommandRepository extends IBaseCommandRepository<ChapterAggregate> {
  findByIdList(idList: string[]): Promise<ChapterAggregate[]>;
  findChapterById(id: string): Promise<ChapterAggregate | undefined>;
  findChapterByName(name: string, id?: string): Promise<ChapterAggregate | undefined>;
}
