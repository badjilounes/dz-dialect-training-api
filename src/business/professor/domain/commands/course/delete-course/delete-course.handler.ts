import { Inject } from '@nestjs/common';

import { CourseAggregate } from '../../../aggregates/course.aggregate';
import { CourseCommandRepository } from '../../../repositories/course-command-repository';
import { COURSE_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { DeleteCourseCommand } from './delete-course.command';

import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseHandler implements ICommandHandler<DeleteCourseCommand> {
  constructor(
    @Inject(COURSE_COMMAND_REPOSITORY)
    private readonly trainingCourseCommandRepository: CourseCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id }: DeleteCourseCommand): Promise<void> {
    const courseById = await this.trainingCourseCommandRepository.findCourseById(id);
    if (!courseById) {
      throw new TrainingCourseNotFoundError(id);
    }

    const course = CourseAggregate.from({
      id: courseById.name,
      name: courseById.name,
      description: courseById.description,
      trainingId: courseById.trainingId,
      exams: courseById.exams,
    });
    this.eventPublisher.mergeObjectContext(course);

    courseById.delete();

    return this.trainingCourseCommandRepository.persist(courseById);
  }
}
