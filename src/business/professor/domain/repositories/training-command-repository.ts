import { TrainingAggregate } from '../aggregates/training.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  getNextOrder(): Promise<number>;
  findByIdList(idList: string[]): Promise<TrainingAggregate[]>;
  findTrainingById(id: string): Promise<TrainingAggregate | undefined>;
  hasTrainingWithName(name: string, trainingId?: string): Promise<boolean>;
}
