import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, In, Repository } from 'typeorm';

import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';

@Injectable()
export class ChapterFixture {
  constructor(@InjectRepository(Chapter) private readonly repository: Repository<Chapter>) {}

  async createChapter(data: DeepPartial<Chapter> = {}): Promise<Chapter> {
    const chapter = this.repository.create({
      name: 'Chapter name',
      description: 'Chapter description',
      isPresentation: false,
      order: 1,
      ...data,
    });

    return this.repository.save(chapter);
  }

  findOneById(id: string): Promise<Chapter | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async clearAll(options?: FindManyOptions<Chapter>): Promise<void> {
    const chapters = await this.repository.find(options);
    const chapterIdList = chapters.map((chapter) => chapter.id);

    if (chapterIdList.length) {
      await this.repository.delete({ id: In(chapterIdList) });
    }
  }
}
