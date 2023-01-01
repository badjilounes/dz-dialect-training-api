import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingChapterAggregate } from '../../aggregates/training-category.aggregate';
import { TrainingChapterNameAlreadyExistError } from '../../errors/training-chapter-name-already-exist-error';
import { TrainingChapterCommandRepository } from '../../repositories/training-category-command-repository';

import { CreateChapterHandler } from './create-chapter.handler';

import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create chapter', () => {
  let handler: CreateChapterHandler;

  let trainingChapterCommandRepository: MockProxy<TrainingChapterCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let chapter: TrainingChapterAggregate;

  const chapterId = 'chapterId';

  beforeEach(() => {
    trainingChapterCommandRepository = mock<TrainingChapterCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateChapterHandler(trainingChapterCommandRepository, uuidGenerator, eventPublisher);

    chapter = TrainingChapterAggregate.from({
      id: chapterId,
      name: 'chapter name',
      description: 'chapter description',
    });
  });

  it('should throw if a chapter already exist for given name', async () => {
    trainingChapterCommandRepository.findChapterByName.mockResolvedValue(chapter);

    await expect(
      handler.execute({ payload: { name: chapter.name, description: chapter.description } }),
    ).rejects.toStrictEqual(new TrainingChapterNameAlreadyExistError(chapter.name));
  });

  it('should create a chapter when no cateogry exist for given name', async () => {
    trainingChapterCommandRepository.findChapterByName.mockResolvedValue(undefined);
    uuidGenerator.generate.mockReturnValueOnce(chapterId);

    const result = await handler.execute({ payload: { name: chapter.name, description: chapter.description } });

    expect(result).toEqual({
      id: chapterId,
      name: chapter.name,
      description: chapter.description,
    });
  });
});
