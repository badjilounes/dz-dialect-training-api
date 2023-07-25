import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessorFacadeModule } from '../../professor/application/facade/professor-facade.module';
import { TrainingCommandHandlers } from '../domain/commands';
import { PROFESSOR_GATEWAY } from '../domain/gateways/tokens';
import { TrainingQueryHandlers } from '../domain/queries';
import { EXAM_COPY_COMMAND_REPOSITORY, EXAM_COPY_QUERY_REPOSITORY } from '../domain/repositories/tokens';
import { TrainingCourse } from '../infrastructure/database/entities/training-course.entity';
import { TrainingExamQuestion } from '../infrastructure/database/entities/training-exam-question.entity';
import { ProfessorFacadeGateway } from '../infrastructure/database/gateways/professor.facade-gateway';

import { StudentController } from './student.controller';

import { ExamCopyResponse } from '@business/student/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';
import { ExamCopyTypeormCommandRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-command-repository';
import { ExamCopyTypeormQueryRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-query-repository';

@Module({
  imports: [
    ProfessorFacadeModule,
    TypeOrmModule.forFeature([
      Training,
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
    { provide: EXAM_COPY_COMMAND_REPOSITORY, useClass: ExamCopyTypeormCommandRepository },
    { provide: EXAM_COPY_QUERY_REPOSITORY, useClass: ExamCopyTypeormQueryRepository },
    { provide: PROFESSOR_GATEWAY, useClass: ProfessorFacadeGateway },
  ],
})
export class StudentModule {}
