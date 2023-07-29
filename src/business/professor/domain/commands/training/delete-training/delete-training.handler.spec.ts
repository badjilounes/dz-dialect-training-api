import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingDeletedEvent } from '../../../events/training-deleted-event';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteTrainingCommand } from './delete-training.command';
import { DeleteTrainingHandler } from './delete-training.handler';

import { EventPublisher } from '@cqrs/event';

describe('Delete training', () => {
  let handler: DeleteTrainingHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  const trainingId = 'trainingId';
  const payload: DeleteTrainingCommand = { id: trainingId };

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new DeleteTrainingHandler(trainingCommandRepository, eventPublisher);

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should delete given training', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(training);

    const result = await handler.execute(payload);

    expect(result).toBeUndefined();
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
    expect(training.getUncommittedEvents()).toEqual(expect.arrayContaining([expect.any(TrainingDeletedEvent)]));
  });
});
