import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChapterFixture } from './chapter.fixture';

import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  providers: [ChapterFixture],
  exports: [ChapterFixture],
})
export class ChapterFixtureModule {}
