import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { CHAPTER_COMMAND_REPOSITORY, TRAINING_COMMAND_REPOSITORY } from '../domain/repositories/tokens';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';

import { ProfessorController } from './professor.controller';

import { Chapter } from '@business/professor/infrastructure/database/entities/chapter.entity';
import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';
import { ChapterTypeormCommandRepository } from '@business/professor/infrastructure/database/repositories/chapter.typeorm-command-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExam, TrainingExamQuestion, Chapter])],
  controllers: [ProfessorController],
  providers: [
    ...TrainingCommandHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: CHAPTER_COMMAND_REPOSITORY, useClass: ChapterTypeormCommandRepository },
  ],
})
export class ProfessorModule {}
