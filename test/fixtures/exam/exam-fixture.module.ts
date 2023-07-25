import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExamFixture } from './exam.fixture';

import { TrainingCourseExam } from '@business/professor/infrastructure/database/entities/training-course-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingCourseExam])],
  providers: [ExamFixture],
  exports: [ExamFixture],
})
export class ExamFixtureModule {}
