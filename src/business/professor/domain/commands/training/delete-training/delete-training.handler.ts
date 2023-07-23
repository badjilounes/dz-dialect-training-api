import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteTrainingCommand } from './delete-training.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteTrainingCommand)
export class DeleteTrainingHandler implements ICommandHandler<DeleteTrainingCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id }: DeleteTrainingCommand): Promise<void> {
    const trainingById = await this.trainingCommandRepository.findTrainingById(id);
    if (!trainingById) {
      throw new TrainingNotFoundError(id);
    }

    const training = TrainingAggregate.from({
      id: trainingById.id,
      name: trainingById.name,
      courses: trainingById.courses,
      description: trainingById.description,
      isPresentation: trainingById.isPresentation,
    });
    this.eventPublisher.mergeObjectContext(training);

    training.delete();

    return this.trainingCommandRepository.persist(training);
  }
}
