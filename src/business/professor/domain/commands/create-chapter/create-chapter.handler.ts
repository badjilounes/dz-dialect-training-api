import { Inject } from '@nestjs/common';

import { ChapterAggregate } from '../../aggregates/chapter.aggregate';
import { TrainingChapterNameAlreadyExistError } from '../../errors/training-chapter-name-already-exist-error';
import { ChapterCommandRepository } from '../../repositories/chapter-command-repository';
import { CHAPTER_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { CreateChapterCommand, CreateChapterCommandResult } from './create-chapter.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateChapterCommand)
export class CreateChapterHandler implements ICommandHandler<CreateChapterCommand> {
  constructor(
    @Inject(CHAPTER_COMMAND_REPOSITORY)
    private readonly trainingChapterCommandRepository: ChapterCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateChapterCommand): Promise<CreateChapterCommandResult> {
    const { name, description } = payload;

    const existingChapter = await this.trainingChapterCommandRepository.findChapterByName(name);
    if (existingChapter) {
      throw new TrainingChapterNameAlreadyExistError(name);
    }

    const chapter = ChapterAggregate.create({
      id: this.uuidGenerator.generate(),
      name,
      description,
    });
    this.eventPublisher.mergeObjectContext(chapter);

    await this.trainingChapterCommandRepository.persist(chapter);

    return {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
    };
  }
}
