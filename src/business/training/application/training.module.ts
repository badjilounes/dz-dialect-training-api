import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { TrainingQueryHandlers } from '../domain/queries';
import { TRAINING_COMMAND_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '../domain/repositories/tokens';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';

import { TrainingController } from './training.controller';

import { TrainingExamResponse } from 'business/training/infrastructure/database/entities/training-exam-response.entity';
import { TrainingExam } from 'business/training/infrastructure/database/entities/training-exam.entity';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';
import { TrainingTypeormQueryRepository } from 'business/training/infrastructure/database/repositories/training.typeorm-query-repository';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExam, TrainingExamQuestion, TrainingExamResponse])],
  controllers: [TrainingController],
  providers: [
    ...TrainingQueryHandlers,
    ...TrainingCommandHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: TRAINING_QUERY_REPOSITORY, useClass: TrainingTypeormQueryRepository },
  ],
})
export class TrainingModule {}
