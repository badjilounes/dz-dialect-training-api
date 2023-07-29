import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderCourse, ReorderCoursesCommand } from './reorder-courses.command';
import { ReorderCoursesHandler } from './reorder-courses.handler';

import { EventPublisher } from '@cqrs/event';

describe('Reorder courses', () => {
  let handler: ReorderCoursesHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let firstCourse: CourseEntity;
  let secondCourse: CourseEntity;

  const trainingId = 'trainingId';
  const firstCourseId = 'firstCourseId';
  const secondCourseId = 'secondCourseId';

  let payload: ReorderCoursesCommand;
  let firstCourseReordered: ReorderCourse;
  let secondCourseReordered: ReorderCourse;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new ReorderCoursesHandler(trainingCommandRepository, eventPublisher);

    firstCourse = CourseEntity.from({
      id: firstCourseId,
      trainingId,
      name: 'firstCourseName',
      description: 'firstCourseDescription',
      exams: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    secondCourse = CourseEntity.from({
      id: secondCourseId,
      trainingId,
      name: 'secondCourseName',
      description: 'secondCourseDescription',
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
      courses: [firstCourse, secondCourse],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    firstCourseReordered = { id: firstCourseId, order: 2 };
    secondCourseReordered = { id: secondCourseId, order: 1 };

    payload = {
      trainingId,
      payload: [firstCourseReordered, secondCourseReordered],
    };

    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should reorder courses', async () => {
    const result = await handler.execute(payload);

    expect(result).toBeUndefined();
    expect(training.courses[0].id).toStrictEqual(firstCourseId);
    expect(training.courses[0].order).toStrictEqual(firstCourseReordered.order);
    expect(training.courses[1].id).toStrictEqual(secondCourseId);
    expect(training.courses[1].order).toStrictEqual(secondCourseReordered.order);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
