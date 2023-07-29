import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingNameAlreadyExistError } from '../../../errors/training-name-already-exist-error';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { CreateTrainingCommandPayload } from './create-training.command';
import { CreateTrainingHandler } from './create-training.handler';

import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create training', () => {
  let handler: CreateTrainingHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const payload: CreateTrainingCommandPayload = {
    name: 'courseName',
    description: 'courseDescription',
    isPresentation: false,
  };

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateTrainingHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    trainingCommandRepository.hasTrainingWithName.mockResolvedValue(false);
  });

  it('should throw if a training already exist for given name', async () => {
    trainingCommandRepository.hasTrainingWithName.mockResolvedValue(true);

    await expect(handler.execute({ payload })).rejects.toStrictEqual(new TrainingNameAlreadyExistError(payload.name));
  });

  it('should create a training', async () => {
    const nextTrainingOrder = 1;
    trainingCommandRepository.getNextOrder.mockResolvedValue(nextTrainingOrder);
    uuidGenerator.generate.mockReturnValueOnce(trainingId);

    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: trainingId,
      name: payload.name,
      description: payload.description,
      isPresentation: payload.isPresentation,
      order: nextTrainingOrder,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(result.createdAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(result.updatedAt.getTime()).toBeCloseTo(Date.now(), -3);
    expect(trainingCommandRepository.persist).toHaveBeenCalledWith(
      expect.objectContaining(
        TrainingAggregate.from({
          id: trainingId,
          name: payload.name,
          description: payload.description,
          isPresentation: payload.isPresentation,
          courses: [],
          order: nextTrainingOrder,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ),
    );
  });
});
