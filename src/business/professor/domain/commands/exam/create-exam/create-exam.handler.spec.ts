import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { ExamEntity } from '../../../entities/exam.entity';
import { TrainingCourseExamNameAlreadyExistError } from '../../../errors/training-course-exam-name-already-exist-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { CreateExamCommandPayload } from './create-exam.command';
import { CreateExamHandler } from './create-exam.handler';

import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create exam', () => {
  let handler: CreateExamHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingCourse: CourseEntity;
  let trainingCourseExam: ExamEntity;

  const examId = 'examId';
  const courseId = 'courseId';
  const trainingId = 'trainingId';
  let payload: CreateExamCommandPayload;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateExamHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    payload = {
      name: 'examName',
      description: 'examDescription',
      trainingId,
      courseId,
      questions: [],
    };

    trainingCourseExam = ExamEntity.from({
      id: 'anotherExamId',
      courseId,
      name: 'anotherExamName',
      description: 'anotherExamDescription',
      questions: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    trainingCourse = CourseEntity.from({
      id: courseId,
      trainingId,
      name: 'courseName',
      description: 'courseDescription',
      exams: [trainingCourseExam],
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

  it('should throw if training course does not exist for given identifiers', async () => {
    payload = { ...payload, courseId: 'unknownCourseId' };

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingCourseNotFoundError(payload.trainingId, payload.courseId),
    );
  });

  it('should throw if an exam already exist for given name', async () => {
    payload.name = trainingCourseExam.name;

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingCourseExamNameAlreadyExistError(payload.courseId, payload.name),
    );
  });

  it('should create an exam', async () => {
    uuidGenerator.generate.mockReturnValueOnce(examId);

    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: examId,
      name: payload.name,
      description: payload.description,
      questions: payload.questions,
      order: trainingCourseExam.order + 1,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(result.createdAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[0].exams[1]).toStrictEqual(
      ExamEntity.from({
        id: examId,
        name: payload.name,
        description: payload.description,
        courseId: payload.courseId,
        questions: [],
        order: trainingCourseExam.order + 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
    expect(training.courses[0].exams[1].createdAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[0].exams[1].updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
