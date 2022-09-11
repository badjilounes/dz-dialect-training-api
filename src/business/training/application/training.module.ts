import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { TrainingQueryHandlers } from '../domain/queries';
import { TRAINING_COMMAND_REPOSITORY } from '../domain/repositories/tokens';
import { TrainingExamQuestion } from '../infrastructure/database/training-exam-question.entity';
import { TrainingExam } from '../infrastructure/database/training-exam.entity';
import { Training } from '../infrastructure/database/training.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/training.typeorm-command-repository';

import { TrainingController } from './training.controller';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExam, TrainingExamQuestion])],
  controllers: [TrainingController],
  providers: [
    ...TrainingQueryHandlers,
    ...TrainingCommandHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
  ],
})
export class TrainingModule {}
