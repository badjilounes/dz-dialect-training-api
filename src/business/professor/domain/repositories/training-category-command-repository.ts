import { TrainingChapterAggregate } from '../aggregates/training-category.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingChapterCommandRepository extends IBaseCommandRepository<TrainingChapterAggregate> {
  findChapterByName(name: string): Promise<TrainingChapterAggregate | undefined>;
}
