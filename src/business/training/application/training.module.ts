import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { TrainingQueryHandlers } from '../domain/queries';
import {
  EXAM_COPY_COMMAND_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
  TRAINING_QUERY_REPOSITORY,
} from '../domain/repositories/tokens';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';

import { TrainingController } from './training.controller';

import { ExamCopyResponse } from 'business/training/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from 'business/training/infrastructure/database/entities/exam-copy.entity';
import { TrainingExam } from 'business/training/infrastructure/database/entities/training-exam.entity';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';
import { ExamCopyTypeormCommandRepository } from 'business/training/infrastructure/database/repositories/exam-copy.typeorm-command-repository';
import { TrainingTypeormQueryRepository } from 'business/training/infrastructure/database/repositories/training.typeorm-query-repository';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExam, TrainingExamQuestion, ExamCopy, ExamCopyResponse])],
  controllers: [TrainingController],
  providers: [
    ...TrainingQueryHandlers,
    ...TrainingCommandHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: EXAM_COPY_COMMAND_REPOSITORY, useClass: ExamCopyTypeormCommandRepository },
    { provide: TRAINING_QUERY_REPOSITORY, useClass: TrainingTypeormQueryRepository },
  ],
})
export class TrainingModule {}
