import { Inject } from '@nestjs/common';

import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { EditCourseCommand, EditCourseCommandResult } from './edit-course.command';

import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditCourseCommand)
export class EditCourseHandler implements ICommandHandler<EditCourseCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ courseId, payload }: EditCourseCommand): Promise<EditCourseCommandResult> {
    const { trainingId } = payload;

    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const courseWithId = training.courses.find((course) => course.id === courseId);
    if (!courseWithId) {
      throw new TrainingCourseNotFoundError(trainingId, courseId);
    }

    const hasCourseWithName = training.courses.some((course) => course.name === payload.name && course.id !== courseId);
    if (hasCourseWithName) {
      throw new TrainingCourseNameAlreadyExistError(trainingId, payload.name);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.updateCourse(courseWithId, {
      name: payload.name,
      description: payload.description,
      color: payload.color,
      order: courseWithId.order,
    });

    await this.trainingCommandRepository.persist(training);

    return {
      id: courseWithId.id,
      name: courseWithId.name,
      description: courseWithId.description,
      color: courseWithId.color,
      trainingId: courseWithId.trainingId,
      order: courseWithId.order,
      createdAt: courseWithId.createdAt,
      updatedAt: courseWithId.updatedAt,
    };
  }
}
