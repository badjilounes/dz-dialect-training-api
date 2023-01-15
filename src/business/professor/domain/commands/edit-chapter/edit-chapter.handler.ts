import { Inject } from '@nestjs/common';

import { ChapterAggregate } from '../../aggregates/chapter.aggregate';
import { TrainingChapterNameAlreadyExistError } from '../../errors/training-chapter-name-already-exist-error';
import { ChapterCommandRepository } from '../../repositories/chapter-command-repository';
import { CHAPTER_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { EditChapterCommand, EditChapterCommandResult } from './edit-chapter.command';

import { TrainingChapterNotFoundError } from '@business/professor/domain/errors/training-chapter-not-found-error';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditChapterCommand)
export class EditChapterHandler implements ICommandHandler<EditChapterCommand> {
  constructor(
    @Inject(CHAPTER_COMMAND_REPOSITORY)
    private readonly trainingChapterCommandRepository: ChapterCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id, payload }: EditChapterCommand): Promise<EditChapterCommandResult> {
    const chapterById = await this.trainingChapterCommandRepository.findChapterById(id);
    if (!chapterById) {
      throw new TrainingChapterNotFoundError(id);
    }

    const chapterByName = await this.trainingChapterCommandRepository.findChapterByName(payload.name, id);
    if (chapterByName) {
      throw new TrainingChapterNameAlreadyExistError(payload.name);
    }

    let chapter = ChapterAggregate.from({
      id: chapterById.id,
      name: chapterById.name,
      description: chapterById.description,
      isPresentation: chapterById.isPresentation,
    });
    this.eventPublisher.mergeObjectContext(chapter);

    chapter = chapter.update(payload);

    await this.trainingChapterCommandRepository.persist(chapter);

    return {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      isPresentation: chapter.isPresentation,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    };
  }
}
