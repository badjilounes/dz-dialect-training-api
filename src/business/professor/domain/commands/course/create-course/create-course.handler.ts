import { Inject } from '@nestjs/common';

import { CourseAggregate } from '../../../aggregates/course.aggregate';
import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { CourseCommandRepository } from '../../../repositories/course-command-repository';
import { COURSE_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { CreateCourseCommand, CreateCourseCommandResult } from './create-course.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(
    @Inject(COURSE_COMMAND_REPOSITORY)
    private readonly trainingCourseCommandRepository: CourseCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateCourseCommand): Promise<CreateCourseCommandResult> {
    const { name, description, trainingId } = payload;

    const existingCourse = await this.trainingCourseCommandRepository.findTrainingCourseByName(trainingId, name);
    if (existingCourse) {
      throw new TrainingCourseNameAlreadyExistError(trainingId, name);
    }

    const course = CourseAggregate.create({
      id: this.uuidGenerator.generate(),
      name,
      description,
      trainingId,
    });

    this.eventPublisher.mergeObjectContext(course);

    await this.trainingCourseCommandRepository.persist(course);

    return {
      id: course.id,
      name: course.name,
      description: course.description,
    };
  }
}
