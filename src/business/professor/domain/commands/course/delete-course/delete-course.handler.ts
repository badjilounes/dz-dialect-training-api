import { Inject } from '@nestjs/common';

import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteCourseCommand } from './delete-course.command';

import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseHandler implements ICommandHandler<DeleteCourseCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, courseId }: DeleteCourseCommand): Promise<void> {
    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const hasCourseWithId = training.courses.some((course) => course.id === courseId);
    if (!hasCourseWithId) {
      throw new TrainingCourseNotFoundError(trainingId, courseId);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.deleteCourse(courseId);

    return this.trainingCommandRepository.persist(training);
  }
}
