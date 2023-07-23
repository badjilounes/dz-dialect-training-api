import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCommandHandlers } from '../domain/commands';
import { TrainingQueryHandlers } from '../domain/queries';
import {
  EXAM_COPY_COMMAND_REPOSITORY,
  EXAM_COPY_QUERY_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
  TRAINING_QUERY_REPOSITORY,
} from '../domain/repositories/tokens';
import { TrainingCourse } from '../infrastructure/database/entities/training-course.entity';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { TrainingLanguage } from '../infrastructure/database/entities/training-language.entity';
import { TrainingTypeormCommandRepository } from '../infrastructure/database/repositories/training.typeorm-command-repository';

import { StudentController } from './student.controller';

import { ExamCopyResponse } from '@business/student/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';
import { ExamCopyTypeormCommandRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-command-repository';
import { ExamCopyTypeormQueryRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-query-repository';
import { TrainingTypeormQueryRepository } from '@business/student/infrastructure/database/repositories/training.typeorm-query-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Training,
      TrainingLanguage,
      TrainingCourse,
      TrainingExam,
      TrainingExamQuestion,
      ExamCopy,
      ExamCopyResponse,
    ]),
  ],
  controllers: [StudentController],
  providers: [
    ...TrainingQueryHandlers,
    ...TrainingCommandHandlers,
    { provide: TRAINING_COMMAND_REPOSITORY, useClass: TrainingTypeormCommandRepository },
    { provide: EXAM_COPY_COMMAND_REPOSITORY, useClass: ExamCopyTypeormCommandRepository },
    { provide: TRAINING_QUERY_REPOSITORY, useClass: TrainingTypeormQueryRepository },
    { provide: EXAM_COPY_QUERY_REPOSITORY, useClass: ExamCopyTypeormQueryRepository },
  ],
})
export class StudentModule {}
