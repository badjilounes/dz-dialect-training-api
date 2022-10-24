import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingFixture } from './training.fixture';

import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training])],
  providers: [TrainingFixture],
  exports: [TrainingFixture],
})
export class TrainingFixtureModule {}
