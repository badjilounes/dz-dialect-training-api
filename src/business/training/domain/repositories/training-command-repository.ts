import { TrainingAggregate } from '../aggregates/training.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  findTrainingById(trainingId: string): Promise<TrainingAggregate | undefined>;
  findPresentation(): Promise<TrainingAggregate | undefined>;
}
