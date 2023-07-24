import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderTrainingsCommand, ReorderTrainingsCommandResult } from './reorder-trainings.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderTrainingsCommand)
export class ReorderTrainingsHandler implements ICommandHandler<ReorderTrainingsCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: ReorderTrainingsCommand): Promise<ReorderTrainingsCommandResult> {
    const trainingList = await this.trainingCommandRepository.findByIdList(payload.map((training) => training.id));

    await Promise.all(
      trainingList.map((training) => {
        const aggregate = TrainingAggregate.from({
          id: training.id,
          name: training.name,
          description: training.description,
          isPresentation: training.isPresentation,
          courses: training.courses,
          order: training.order,
          createdAt: training.createdAt,
          updatedAt: training.updatedAt,
        });
        this.eventPublisher.mergeObjectContext(aggregate);

        const newOrder = payload.find((c) => c.id === aggregate.id)?.order;

        if (newOrder !== undefined) {
          aggregate.reorder(newOrder);
        }

        return this.trainingCommandRepository.persist(aggregate);
      }),
    );
  }
}
