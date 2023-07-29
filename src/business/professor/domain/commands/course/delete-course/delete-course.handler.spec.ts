import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteCourseCommand } from './delete-course.command';
import { DeleteCourseHandler } from './delete-course.handler';

import { EventPublisher } from '@cqrs/event';

describe('Delete course', () => {
  let handler: DeleteCourseHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  const courseId = 'courseId';
  const trainingId = 'trainingId';

  let payload: DeleteCourseCommand;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new DeleteCourseHandler(trainingCommandRepository, eventPublisher);

    payload = { trainingId, courseId };

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
          exams: [],
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
    expect(training.courses).toHaveLength(0);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
