import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ChapterAggregate } from '@business/professor/domain/aggregates/chapter.aggregate';
import { ChapterCreatedEvent } from '@business/professor/domain/events/chapter-created-event';
import { ChapterDeletedEvent } from '@business/professor/domain/events/chapter-deleted-event';
import { ChapterReorderedEvent } from '@business/professor/domain/events/chapter-reordered-event';
import { ChapterUpdatedEvent } from '@business/professor/domain/events/chapter-updated-event';
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
    this.register(ChapterUpdatedEvent, this.updateChapter);
    this.register(ChapterDeletedEvent, this.deleteChapter);
    this.register(ChapterReorderedEvent, this.reorderChapter);
  }
  async findByIdList(idList: string[]): Promise<ChapterAggregate[]> {
    const chapters = idList.length ? await this.chapterRepository.find({ where: { id: In(idList) } }) : [];
    return chapters.map((chapter) =>
      ChapterAggregate.from({
        id: chapter.id,
        name: chapter.name,
        description: chapter.description,
        isPresentation: chapter.isPresentation,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      }),
    );
  }

  public async findChapterById(id: string): Promise<ChapterAggregate | undefined> {
    const chapter = await this.chapterRepository.findOne({ where: { id } });

    if (!chapter) {
      return undefined;
    }

    return ChapterAggregate.from({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      isPresentation: chapter.isPresentation,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    });
  }

  async findChapterByName(name: string, id?: string): Promise<ChapterAggregate | undefined> {
    const chapter = id
      ? await this.chapterRepository.findOne({ where: { name, id: Not(id) } })
      : await this.chapterRepository.findOne({ where: { name } });

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
    const [maxOrder] = await this.chapterRepository.find({ order: { order: 'DESC' }, take: 1 });

    const chapter = this.repository.create({
      id: event.chapter.id,
      name: event.chapter.name,
      description: event.chapter.description,
      isPresentation: event.chapter.isPresentation,
      order: maxOrder?.order ? maxOrder.order + 1 : 1,
    });
    return this.repository.save(chapter);
  }

  private async updateChapter(event: ChapterUpdatedEvent): Promise<void> {
    await this.chapterRepository.update(event.id, event.payload);
  }

  private async deleteChapter(event: ChapterDeletedEvent): Promise<void> {
    await this.chapterRepository.delete(event.id);
  }

  private async reorderChapter(event: ChapterReorderedEvent): Promise<void> {
    await this.chapterRepository.update(event.id, { order: event.order });
  }
}
