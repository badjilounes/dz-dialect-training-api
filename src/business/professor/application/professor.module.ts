import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { TRAINING_COMMAND_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '../domain/repositories/tokens';
import { TrainingCourse } from '../infrastructure/database/entities/training-course.entity';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';
import { TrainingTypeormQueryRepository } from '../infrastructure/database/repositories/training.typeorm-query-repository';

import { ProfessorController } from './professor.controller';

import { ProfessorQueryHandlers } from '@business/professor/domain/queries';
import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingCourse, TrainingExam, TrainingExamQuestion])],
  controllers: [ProfessorController],
  providers: [
    ...TrainingCommandHandlers,
    ...ProfessorQueryHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: TRAINING_QUERY_REPOSITORY, useClass: TrainingTypeormQueryRepository },
  ],
})
export class ProfessorModule {}
