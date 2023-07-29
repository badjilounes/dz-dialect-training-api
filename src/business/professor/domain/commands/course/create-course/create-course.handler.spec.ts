import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { CreateCourseCommandPayload } from './create-course.command';
import { CreateCourseHandler } from './create-course.handler';

import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create course', () => {
  let handler: CreateCourseHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingCourse: CourseEntity;

  const courseId = 'courseId';
  const trainingId = 'trainingId';
  let payload: CreateCourseCommandPayload;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateCourseHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    payload = {
      name: 'courseName',
      description: 'courseDescription',
      trainingId,
    };

    trainingCourse = CourseEntity.from({
      id: 'anotherCourseId',
      trainingId,
      name: 'anotherCourseName',
      description: 'anotherCourseDescription',
      exams: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [trainingCourse],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute({ payload })).rejects.toStrictEqual(new TrainingNotFoundError(payload.trainingId));
  });

  it('should throw if a course already exist for given name', async () => {
    payload.name = trainingCourse.name;

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingCourseNameAlreadyExistError(payload.trainingId, payload.name),
    );
  });

  it('should create a course', async () => {
    uuidGenerator.generate.mockReturnValueOnce(courseId);

    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: courseId,
      name: payload.name,
      description: payload.description,
      order: trainingCourse.order + 1,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(result.createdAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[1]).toStrictEqual(
      CourseEntity.from({
        id: courseId,
        trainingId,
        name: payload.name,
        description: payload.description,
        order: trainingCourse.order + 1,
        exams: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
    expect(training.courses[1].createdAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[1].updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
