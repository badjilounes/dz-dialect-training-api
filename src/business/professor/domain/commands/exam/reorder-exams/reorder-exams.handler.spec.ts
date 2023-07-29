import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { ExamEntity } from '../../../entities/exam.entity';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderExam, ReorderExamsCommand } from './reorder-exams.command';
import { ReorderExamsHandler } from './reorder-exams.handler';

import { EventPublisher } from '@cqrs/event';

describe('Reorder exams', () => {
  let handler: ReorderExamsHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingCourse: CourseEntity;
  let firstExam: ExamEntity;
  let secondExam: ExamEntity;

  const trainingId = 'trainingId';
  const courseId = 'courseId';
  const firstExamId = 'firstExamId';
  const secondExamId = 'secondExamId';

  let payload: ReorderExamsCommand;
  let firstExamReordered: ReorderExam;
  let secondExamReordered: ReorderExam;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new ReorderExamsHandler(trainingCommandRepository, eventPublisher);

    firstExam = ExamEntity.from({
      id: firstExamId,
      courseId,
      name: 'firstExamName',
      description: 'firstExamDescription',
      questions: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    secondExam = ExamEntity.from({
      id: secondExamId,
      courseId,
      name: 'secondExamName',
      description: 'secondExamDescription',
      questions: [],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    trainingCourse = CourseEntity.from({
      id: courseId,
      trainingId,
      name: 'courseName',
      description: 'courseDescription',
      exams: [firstExam, secondExam],
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

    firstExamReordered = { id: firstExamId, order: 2 };
    secondExamReordered = { id: secondExamId, order: 1 };

    payload = {
      trainingId,
      courseId,
      payload: [firstExamReordered, secondExamReordered],
    };

    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should throw if no course have given identifier for given training', async () => {
    payload = { ...payload, courseId: 'unknownCourseId' };

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new TrainingCourseNotFoundError(payload.trainingId, payload.courseId),
    );
  });

  it('should reorder exams', async () => {
    const result = await handler.execute(payload);

    expect(result).toBeUndefined();
    expect(training.courses[0].exams[0].id).toStrictEqual(firstExamId);
    expect(training.courses[0].exams[0].order).toStrictEqual(firstExamReordered.order);
    expect(training.courses[0].exams[1].id).toStrictEqual(secondExamId);
    expect(training.courses[0].exams[1].order).toStrictEqual(secondExamReordered.order);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
