import { mock, MockProxy } from 'jest-mock-extended';

import { LanguageEntity } from '../../../entities/language.entity';

import { CreateTrainingHandler } from './create-training.handler';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { CreateTrainingCommandPayload } from '@business/professor/domain/commands/training/create-training/create-training.command';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create presentation', () => {
  let handler: CreateTrainingHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  let payload: CreateTrainingCommandPayload;

  const languageId = 'languageId';
  const trainingId = 'trainingId';
  const courseId = 'courseId';
  const examId = 'examId';
  const questionId = 'questionId';

  const existingLanguage = {
    id: languageId,
    from: 'fr',
    learning: 'dz',
  };

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateTrainingHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    payload = {
      name: 'presentation training',
      description: 'presentation training description',
      isPresentation: false,
    };

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'presentation training',
      description: 'presentation training description',
      isPresentation: false,
      courses: [],
    });
  });

  beforeEach(() => {
    uuidGenerator.generate.mockReturnValueOnce(trainingId);
    uuidGenerator.generate.mockReturnValueOnce(courseId);
    uuidGenerator.generate.mockReturnValueOnce(examId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);
  });

  it('should create a training', async () => {
    trainingCommandRepository.findTrainingLanguage.mockResolvedValueOnce(LanguageEntity.from(existingLanguage));

    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: trainingId,
      name: payload.name,
      description: payload.description,
      isPresentation: payload.isPresentation,
    });
  });
});
