import { Inject } from '@nestjs/common';

import { ChapterAggregate } from '../../aggregates/chapter.aggregate';
import { ChapterCommandRepository } from '../../repositories/chapter-command-repository';
import { CHAPTER_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { DeleteChapterCommand } from './delete-chapter.command';

import { TrainingChapterNotFoundError } from '@business/professor/domain/errors/training-chapter-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteChapterCommand)
export class DeleteChapterHandler implements ICommandHandler<DeleteChapterCommand> {
  constructor(
    @Inject(CHAPTER_COMMAND_REPOSITORY)
    private readonly trainingChapterCommandRepository: ChapterCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id }: DeleteChapterCommand): Promise<void> {
    const chapterById = await this.trainingChapterCommandRepository.findChapterById(id);
    if (!chapterById) {
      throw new TrainingChapterNotFoundError(id);
    }

    const chapter = ChapterAggregate.from({
      id: chapterById.name,
      name: chapterById.name,
      description: chapterById.description,
      isPresentation: chapterById.isPresentation,
    });
    this.eventPublisher.mergeObjectContext(chapter);

    chapterById.delete();

    return this.trainingChapterCommandRepository.persist(chapterById);
  }
}
