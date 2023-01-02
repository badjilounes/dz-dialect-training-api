import { Module } from '@nestjs/common';

import { ChapterFixtureModule } from './chapter/chapter-fixture.module';
import { ExamCopyFixtureModule } from './exam-copy/exam-copy-fixture.module';
import { ExamFixtureModule } from './exam/exam-fixture.module';
import { TrainingFixtureModule } from './training/training-fixture.module';

const fixtures = [TrainingFixtureModule, ExamFixtureModule, ExamCopyFixtureModule, ChapterFixtureModule];

@Module({
  imports: fixtures,
  exports: fixtures,
})
export class FixtureModule {}
