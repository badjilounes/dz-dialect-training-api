import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingNameAlreadyExistError } from '../../../errors/training-name-already-exist-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { EditTrainingCommand } from './edit-training.command';
import { EditTrainingHandler } from './edit-training.handler';

import { EventPublisher } from '@cqrs/event';

describe('Edit training', () => {
  let handler: EditTrainingHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  const trainingId = 'trainingId';

  let payload: EditTrainingCommand;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new EditTrainingHandler(trainingCommandRepository, eventPublisher);

    payload = {
      id: trainingId,
      payload: {
        name: 'trainingNameUpdated',
        description: 'trainingDescriptionUpdated',
        isPresentation: true,
      },
    };

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

    trainingCommandRepository.hasTrainingWithName.mockResolvedValue(false);
    trainingCommandRepository.findTrainingById.mockResolvedValue(training);
  });

  it('should throw if training does not exist for given identifier', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new TrainingNotFoundError(training.id));
  });

  it('should throw if another training already exist for given name', async () => {
    trainingCommandRepository.hasTrainingWithName.mockResolvedValue(true);

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new TrainingNameAlreadyExistError(payload.payload.name),
    );
  });

  it('should edit given training', async () => {
    const result = await handler.execute(payload);

    expect(result).toEqual({
      id: trainingId,
      name: payload.payload.name,
      description: payload.payload.description,
      isPresentation: payload.payload.isPresentation,
      order: training.order,
      createdAt: training.createdAt,
      updatedAt: expect.any(Date),
    });
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(training.name).toStrictEqual(payload.payload.name);
    expect(training.description).toStrictEqual(payload.payload.description);
    expect(training.isPresentation).toStrictEqual(payload.payload.isPresentation);
    expect(training.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  });
});
