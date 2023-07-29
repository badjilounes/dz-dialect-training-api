import { mock, MockProxy } from 'jest-mock-extended';

import { UuidGenerator } from '../../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { CourseEntity } from '../../../entities/course.entity';
import { ExamEntity } from '../../../entities/exam.entity';
import { TrainingCourseExamNameAlreadyExistError } from '../../../errors/training-course-exam-name-already-exist-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { EditExamCommandPayload } from './edit-exam.command';
import { EditExamHandler } from './edit-exam.handler';

import { EventPublisher } from '@cqrs/event';

describe('Edit exam', () => {
  let handler: EditExamHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingCourse: CourseEntity;
  let trainingCourseExam: ExamEntity;
  let anotherTrainingCourseExam: ExamEntity;

  const examId = 'examId';
  const courseId = 'courseId';
  const trainingId = 'trainingId';

  let payload: EditExamCommandPayload;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new EditExamHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    payload = {
      trainingId,
      courseId,
      examId,
      name: 'examNameUpdated',
      description: 'examDescriptionUpdated',
      questions: [],
    };

    trainingCourseExam = ExamEntity.from({
      id: examId,
      courseId,
      name: 'anotherExamName',
      description: 'anotherExamDescription',
      questions: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    anotherTrainingCourseExam = ExamEntity.from({
      id: 'anotherExamId',
      courseId,
      name: 'anotherExamName',
      description: 'anotherExamDescription',
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
      exams: [trainingCourseExam, anotherTrainingCourseExam],
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

    await expect(handler.execute({ payload })).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should throw if training does not have a course with for given identifier', async () => {
    payload = { ...payload, courseId: 'unknownCourseId' };

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingCourseNotFoundError(trainingId, payload.courseId),
    );
  });

  it('should throw if another exam already exist for given name', async () => {
    payload = { ...payload, name: anotherTrainingCourseExam.name };

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingCourseExamNameAlreadyExistError(courseId, payload.name),
    );
  });

  it('should edit given course', async () => {
    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: examId,
      name: payload.name,
      description: payload.description,
      questions: payload.questions,
      order: trainingCourseExam.order,
      createdAt: trainingCourseExam.createdAt,
      updatedAt: expect.any(Date),
    });
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.courses[0].exams[0].name).toStrictEqual(payload.name);
    expect(training.courses[0].exams[0].description).toStrictEqual(payload.description);
    expect(training.courses[0].exams[0].questions).toStrictEqual(payload.questions);
    expect(training.courses[0].exams[0].updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
