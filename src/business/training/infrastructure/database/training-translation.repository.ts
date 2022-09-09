import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingTranslationAggregate } from '../../domain/aggregates/training-translation.aggregate';
import { TrainingTranslationCreatedEvent } from '../../domain/events/training-translation-created-event';

import { TrainingTranslation } from './training-translation.entity';

import { AppContextService } from 'src/core/context/app-context.service';
import { BaseTypeormCommandRepository } from 'src/shared/infrastructure/base.typeorm-command-repository';

export class TrainingTranslationRepository extends BaseTypeormCommandRepository<TrainingTranslationAggregate> {
  constructor(
    @InjectRepository(TrainingTranslation)
    protected readonly repository: Repository<TrainingTranslation>,
    protected readonly context: AppContextService,
  ) {
    super(repository, context);
    this.register(TrainingTranslationCreatedEvent, this.createTrainingTranslation);
  }

  private createTrainingTranslation(event: TrainingTranslationCreatedEvent): Promise<TrainingTranslation> {
    return this.repository.save({
      id: event.training.id,
      userId: this.userId,
      state: event.training.state,
      language: 'dz',
      steps: event.training.steps.map((step, order) => ({
        id: step.id,
        question: step.question,
        answer: step.answer,
        order,
        response: step.response,
        valid: step.valid,
      })),
    });
  }
}
