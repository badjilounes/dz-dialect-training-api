import { Inject } from '@nestjs/common';

import { ChapterAggregate } from '../../aggregates/chapter.aggregate';
import { ChapterCommandRepository } from '../../repositories/chapter-command-repository';
import { CHAPTER_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { ReorderChaptersCommand, ReorderChaptersCommandResult } from './reorder-chapters.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderChaptersCommand)
export class ReorderChaptersHandler implements ICommandHandler<ReorderChaptersCommand> {
  constructor(
    @Inject(CHAPTER_COMMAND_REPOSITORY)
    private readonly trainingChapterCommandRepository: ChapterCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: ReorderChaptersCommand): Promise<ReorderChaptersCommandResult> {
    const chapterList = await this.trainingChapterCommandRepository.findByIdList(payload.map((chapter) => chapter.id));

    await Promise.all(
      chapterList.map((chapter) => {
        const chapterAggregate = ChapterAggregate.from({
          id: chapter.id,
          name: chapter.name,
          description: chapter.description,
          isPresentation: chapter.isPresentation,
        });
        this.eventPublisher.mergeObjectContext(chapterAggregate);

        const newOrder = payload.find((c) => c.id === chapterAggregate.id)?.order;

        if (newOrder !== undefined) {
          chapterAggregate.reorder(newOrder);
        }

        return this.trainingChapterCommandRepository.persist(chapterAggregate);
      }),
    );
  }
}
