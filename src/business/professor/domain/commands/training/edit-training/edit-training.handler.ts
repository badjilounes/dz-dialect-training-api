import { Inject } from '@nestjs/common';

import { TrainingNameAlreadyExistError } from '../../../errors/training-name-already-exist-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { EditTrainingCommand, EditTrainingCommandResult } from './edit-training.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditTrainingCommand)
export class EditTrainingHandler implements ICommandHandler<EditTrainingCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id, payload }: EditTrainingCommand): Promise<EditTrainingCommandResult> {
    const training = await this.trainingCommandRepository.findTrainingById(id);
    if (!training) {
      throw new TrainingNotFoundError(id);
    }

    const hasTrainingWithName = await this.trainingCommandRepository.hasTrainingWithName(payload.name, id);
    if (hasTrainingWithName) {
      throw new TrainingNameAlreadyExistError(payload.name);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.update({
      name: payload.name,
      description: payload.description,
      isPresentation: payload.isPresentation,
      updatedAt: new Date(),
    });

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      name: training.name,
      description: training.description,
      isPresentation: training.isPresentation,
      order: training.order,
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    };
  }
}
