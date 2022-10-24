import { Module } from '@nestjs/common';

import { ExamCopyFixtureModule } from './exam-copy/exam-copy-fixture.module';
import { TrainingFixtureModule } from './training/training-fixture.module';

const fixtures = [TrainingFixtureModule, ExamCopyFixtureModule];

@Module({
  imports: fixtures,
  exports: fixtures,
})
export class FixtureModule {}
