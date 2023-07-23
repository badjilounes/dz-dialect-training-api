import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
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
    const trainingById = await this.trainingCommandRepository.findTrainingById(id);
    if (!trainingById) {
      throw new TrainingNotFoundError(id);
    }

    const trainingByName = await this.trainingCommandRepository.findTrainingByName(payload.name, id);
    if (trainingByName) {
      throw new TrainingNameAlreadyExistError(payload.name);
    }

    let training = TrainingAggregate.from({
      id: trainingById.id,
      name: trainingById.name,
      description: trainingById.description,
      isPresentation: trainingById.isPresentation,
      courses: trainingById.courses,
    });
    this.eventPublisher.mergeObjectContext(training);

    training = training.update(payload);

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      name: training.name,
      description: training.description,
      isPresentation: training.isPresentation,
    };
  }
}
