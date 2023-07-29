import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { TrainingCourseNameAlreadyExistError } from '../../../errors/training-course-name-already-exist-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { EditCourseCommand } from './edit-course.command';
import { EditCourseHandler } from './edit-course.handler';

import { EventPublisher } from '@cqrs/event';

describe('Edit course', () => {
  let handler: EditCourseHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingCourse: CourseEntity;
  let anotherCourse: CourseEntity;

  const courseId = 'courseId';
  const trainingId = 'trainingId';

  let payload: EditCourseCommand;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new EditCourseHandler(trainingCommandRepository, eventPublisher);

    payload = {
      courseId,
      payload: {
        name: 'courseNameUpdated',
        description: 'courseDescriptionUpdated',
        trainingId,
      },
    };

    trainingCourse = CourseEntity.from({
      id: courseId,
      trainingId,
      name: 'courseName',
      description: 'courseDescription',
      exams: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    anotherCourse = CourseEntity.from({
      id: 'anotherCourseId',
      trainingId,
      name: 'anotherCourseName',
      description: 'anotherCourseDescription',
      exams: [],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [trainingCourse, anotherCourse],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should throw if training does not have a course with for given identifier', async () => {
    payload = { ...payload, courseId: 'unknownCourseId' };

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new TrainingCourseNotFoundError(trainingId, payload.courseId),
    );
  });

  it('should throw if another course already exist for given name', async () => {
    payload = { ...payload, payload: { ...payload.payload, name: anotherCourse.name } };

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new TrainingCourseNameAlreadyExistError(trainingId, payload.payload.name),
    );
  });

  it('should edit given course', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(training);

    const result = await handler.execute(payload);

    expect(result).toEqual({
      id: trainingCourse.id,
      trainingId: trainingCourse.trainingId,
      name: payload.payload.name,
      description: payload.payload.description,
      order: trainingCourse.order,
      createdAt: trainingCourse.createdAt,
      updatedAt: expect.any(Date),
    });
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[0].name).toStrictEqual(payload.payload.name);
    expect(training.courses[0].description).toStrictEqual(payload.payload.description);
    expect(training.courses[0].updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
