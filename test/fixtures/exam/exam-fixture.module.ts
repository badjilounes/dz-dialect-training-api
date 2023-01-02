import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExamFixture } from './exam.fixture';

import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExam])],
  providers: [ExamFixture],
  exports: [ExamFixture],
})
export class ExamFixtureModule {}
