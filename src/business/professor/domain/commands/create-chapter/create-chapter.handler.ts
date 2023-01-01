import { Inject } from '@nestjs/common';

import { TrainingChapterAggregate } from '../../aggregates/training-category.aggregate';
import { TrainingChapterNameAlreadyExistError } from '../../errors/training-chapter-name-already-exist-error';
import { TRAINING_CHAPTER_COMMAND_REPOSITORY } from '../../repositories/tokens';
import { TrainingChapterCommandRepository } from '../../repositories/training-category-command-repository';

import { CreateChapterCommand, CreateChapterCommandResult } from './create-chapter.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateChapterCommand)
export class CreateChapterHandler implements ICommandHandler<CreateChapterCommand> {
  constructor(
    @Inject(TRAINING_CHAPTER_COMMAND_REPOSITORY)
    private readonly trainingChapterCommandRepository: TrainingChapterCommandRepository,

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

    const categoryId = this.uuidGenerator.generate();

    const category = TrainingChapterAggregate.create({
      id: categoryId,
      name,
      description,
    });

    this.eventPublisher.mergeObjectContext(category);

    await this.trainingChapterCommandRepository.persist(category);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }
}
