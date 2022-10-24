import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingFixtureModule } from '../training/training-fixture.module';

import { ExamCopyFixture } from './exam-copy.fixture';

import { ExamCopyResponse } from '@business/training/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from '@business/training/infrastructure/database/entities/exam-copy.entity';

@Module({
  imports: [TrainingFixtureModule, TypeOrmModule.forFeature([ExamCopy, ExamCopyResponse])],
  providers: [ExamCopyFixture],
})
export class ExamCopyFixtureModule {}
