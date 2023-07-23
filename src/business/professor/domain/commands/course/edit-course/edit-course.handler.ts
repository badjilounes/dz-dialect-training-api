import { Inject } from '@nestjs/common';

import { CourseAggregate } from '../../../aggregates/course.aggregate';
import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { CourseCommandRepository } from '../../../repositories/course-command-repository';
import { COURSE_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { EditCourseCommand, EditCourseCommandResult } from './edit-course.command';

import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditCourseCommand)
export class EditCourseHandler implements ICommandHandler<EditCourseCommand> {
  constructor(
    @Inject(COURSE_COMMAND_REPOSITORY)
    private readonly trainingCourseCommandRepository: CourseCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id, payload }: EditCourseCommand): Promise<EditCourseCommandResult> {
    const courseById = await this.trainingCourseCommandRepository.findCourseById(id);
    if (!courseById) {
      throw new TrainingCourseNotFoundError(id);
    }

    const courseByName = await this.trainingCourseCommandRepository.findTrainingCourseByName(
      payload.trainingId,
      payload.name,
      id,
    );
    if (courseByName) {
      throw new TrainingCourseNameAlreadyExistError(payload.trainingId, payload.name);
    }

    let course = CourseAggregate.from({
      id: courseById.id,
      name: courseById.name,
      description: courseById.description,
      trainingId: courseById.trainingId,
      exams: courseById.exams,
    });
    this.eventPublisher.mergeObjectContext(course);

    course = course.update({ name: payload.name, description: payload.description });

    await this.trainingCourseCommandRepository.persist(course);

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      trainingId: course.trainingId,
    };
  }
}
