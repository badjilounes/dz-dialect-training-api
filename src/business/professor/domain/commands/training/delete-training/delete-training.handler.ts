import { Inject } from '@nestjs/common';

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
    const training = await this.trainingCommandRepository.findTrainingById(id);
    if (!training) {
      throw new TrainingNotFoundError(id);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.delete();

    return this.trainingCommandRepository.persist(training);
  }
}
