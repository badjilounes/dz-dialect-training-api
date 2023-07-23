import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import {
  COURSE_COMMAND_REPOSITORY,
  COURSE_QUERY_REPOSITORY,
  EXAM_COMMAND_REPOSITORY,
  EXAM_QUERY_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
  TRAINING_QUERY_REPOSITORY,
} from '../domain/repositories/tokens';
import { TrainingCourse } from '../infrastructure/database/entities/training-course.entity';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingLanguage } from '../infrastructure/database/entities/training-language.entity';
import { CourseTypeormCommandRepository } from '../infrastructure/database/repositories/course.typeorm-command-repository';
import { CourseTypeormQueryRepository } from '../infrastructure/database/repositories/course.typeorm-query-repository';
import { ExamTypeormCommandRepository } from '../infrastructure/database/repositories/exam.typeorm-command-repository';
import { ExamTypeormQueryRepository } from '../infrastructure/database/repositories/exam.typeorm-query-repository';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';
import { TrainingTypeormQueryRepository } from '../infrastructure/database/repositories/training.typeorm-query-repository';

import { ProfessorController } from './professor.controller';

import { ProfessorQueryHandlers } from '@business/professor/domain/queries';
import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingCourse, TrainingLanguage, TrainingExam, TrainingExamQuestion])],
  controllers: [ProfessorController],
  providers: [
    ...TrainingCommandHandlers,
    ...ProfessorQueryHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: TRAINING_QUERY_REPOSITORY, useClass: TrainingTypeormQueryRepository },
    { provide: COURSE_COMMAND_REPOSITORY, useClass: CourseTypeormCommandRepository },
    { provide: COURSE_QUERY_REPOSITORY, useClass: CourseTypeormQueryRepository },
    { provide: EXAM_COMMAND_REPOSITORY, useClass: ExamTypeormCommandRepository },
    { provide: EXAM_QUERY_REPOSITORY, useClass: ExamTypeormQueryRepository },
  ],
})
export class ProfessorModule {}
