import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteExamCommand } from './delete-exam.command';
import { DeleteExamHandler } from './delete-exam.handler';

import { EventPublisher } from '@cqrs/event';

describe('Delete exam', () => {
  let handler: DeleteExamHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  const examId = 'examId';
  const courseId = 'courseId';
  const trainingId = 'trainingId';

  let payload: DeleteExamCommand;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new DeleteExamHandler(trainingCommandRepository, eventPublisher);

    payload = { trainingId, courseId, examId };

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [
        {
          id: courseId,
          trainingId,
          name: 'courseName',
          description: 'courseDescription',
          exams: [
            {
              id: examId,
              courseId,
              name: 'examName',
              description: 'examDescription',
              questions: [],
              order: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(payload.trainingId));
  });

  it('should throw if no course have given identifier for given training', async () => {
    payload = { ...payload, courseId: 'unknownCourseId' };

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new TrainingCourseNotFoundError(payload.trainingId, payload.courseId),
    );
  });

  it('should delete given course', async () => {
    const result = await handler.execute(payload);

    expect(result).toBeUndefined();
    expect(training.courses[0].exams).toHaveLength(0);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
