import { Inject } from '@nestjs/common';

import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderCoursesCommandResult, ReorderExamsCommand } from './reorder-exams.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderExamsCommand)
export class ReorderExamsHandler implements ICommandHandler<ReorderExamsCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, courseId, payload }: ReorderExamsCommand): Promise<ReorderCoursesCommandResult> {
    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const course = training.courses.find((c) => c.id === courseId);
    if (!course) {
      throw new TrainingCourseNotFoundError(trainingId, courseId);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.reorderCourseExams(course, payload);

    await this.trainingCommandRepository.persist(training);
  }
}
