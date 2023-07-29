import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { ReorderTraining, ReorderTrainingsCommand } from './reorder-trainings.command';
import { ReorderTrainingsHandler } from './reorder-trainings.handler';

import { EventPublisher } from '@cqrs/event';

describe('Reorder trainings', () => {
  let handler: ReorderTrainingsHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  let firstTraining: TrainingAggregate;
  let secondTraining: TrainingAggregate;

  const firstTrainingId = 'firstTrainingId';
  const secondTrainingId = 'secondTrainingId';

  let payload: ReorderTrainingsCommand;
  let firstTrainingReordered: ReorderTraining;
  let secondTrainingReordered: ReorderTraining;

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    eventPublisher = mock<EventPublisher>();

    handler = new ReorderTrainingsHandler(trainingCommandRepository, eventPublisher);

    firstTraining = TrainingAggregate.from({
      id: firstTrainingId,
      name: 'firstTrainingName',
      description: 'firstTrainingDescription',
      isPresentation: false,
      courses: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    secondTraining = TrainingAggregate.from({
      id: secondTrainingId,
      name: 'secondTrainingName',
      description: 'secondTrainingDescription',
      isPresentation: false,
      courses: [],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    firstTrainingReordered = { id: firstTrainingId, order: 2 };
    secondTrainingReordered = { id: secondTrainingId, order: 1 };

    payload = {
      payload: [firstTrainingReordered, secondTrainingReordered],
    };

    trainingCommandRepository.findByIdList.mockResolvedValue([firstTraining, secondTraining]);
  });
  it('should reorder trainings', async () => {
    const result = await handler.execute(payload);

    expect(result).toBeUndefined();
    expect(firstTraining.getUncommittedEvents()).toContainEqual(firstTrainingReordered);
    expect(secondTraining.getUncommittedEvents()).toContainEqual(secondTrainingReordered);
  });
});
