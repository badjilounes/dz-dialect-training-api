import { Inject } from '@nestjs/common';

import { CourseEntity } from '../../../entities/course.entity';
import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { CreateCourseCommand, CreateCourseCommandResult } from './create-course.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateCourseCommand): Promise<CreateCourseCommandResult> {
    const { name, description, trainingId } = payload;

    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const hasCourseWithName = training.courses.some((course) => course.name === name);
    if (hasCourseWithName) {
      throw new TrainingCourseNameAlreadyExistError(trainingId, name);
    }

    this.eventPublisher.mergeObjectContext(training);

    const nextOrder = Math.max(...training.courses.map((course) => course.order), 0) + 1;
    const course = CourseEntity.create({
      id: this.uuidGenerator.generate(),
      trainingId,
      name,
      description,
      order: nextOrder,
      exams: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    training.addCourse(course);

    await this.trainingCommandRepository.persist(training);

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      order: course.order,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
