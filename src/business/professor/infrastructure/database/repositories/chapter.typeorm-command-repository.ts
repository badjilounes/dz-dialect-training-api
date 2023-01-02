import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChapterAggregate } from '@business/professor/domain/aggregates/chapter.aggregate';
import { ChapterCreatedEvent } from '@business/professor/domain/events/chapter-created-event';
import { ChapterCommandRepository } from '@business/professor/domain/repositories/chapter-command-repository';
import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class ChapterTypeormCommandRepository
  extends BaseTypeormCommandRepository<ChapterAggregate>
  implements ChapterCommandRepository
{
  constructor(
    @InjectRepository(Chapter)
    protected readonly chapterRepository: Repository<Chapter>,

    protected readonly context: AppContextService,
  ) {
    super(chapterRepository, context);
    this.register(ChapterCreatedEvent, this.createChapter);
  }
  async findChapterByName(name: string): Promise<ChapterAggregate | undefined> {
    const chapter = await this.chapterRepository.findOne({ where: { name } });

    if (!chapter) {
      return undefined;
    }

    return ChapterAggregate.from({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      isPresentation: chapter.isPresentation,
    });
  }

  private async createChapter(event: ChapterCreatedEvent): Promise<Chapter> {
    const chapter = this.repository.create({
      id: event.chapter.id,
      name: event.chapter.name,
      description: event.chapter.description,
    });
    return this.repository.save(chapter);
  }
}
