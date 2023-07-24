import { Inject } from '@nestjs/common';

import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderCoursesCommand, ReorderCoursesCommandResult } from './reorder-courses.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderCoursesCommand)
export class ReorderCoursesHandler implements ICommandHandler<ReorderCoursesCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, payload }: ReorderCoursesCommand): Promise<ReorderCoursesCommandResult> {
    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.reorderCourses(payload);

    await this.trainingCommandRepository.persist(training);
  }
}
