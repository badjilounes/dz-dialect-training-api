import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingFixtureModule } from '../training/training-fixture.module';

import { ExamCopyFixture } from './exam-copy.fixture';

import { ExamCopyQuestionResponse } from '@business/student/infrastructure/database/entities/exam-copy-question-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';

@Module({
  imports: [TrainingFixtureModule, TypeOrmModule.forFeature([ExamCopy, ExamCopyQuestionResponse])],
  providers: [ExamCopyFixture],
})
export class ExamCopyFixtureModule {}
