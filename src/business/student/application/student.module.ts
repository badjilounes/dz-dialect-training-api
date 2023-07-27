import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessorFacadeModule } from '../../professor/application/facade/professor-facade.module';
import { TrainingCommandHandlers } from '../domain/commands';
import { PROFESSOR_GATEWAY } from '../domain/gateways/tokens';
import { TrainingQueryHandlers } from '../domain/queries';
import { EXAM_COPY_COMMAND_REPOSITORY, EXAM_COPY_QUERY_REPOSITORY } from '../domain/repositories/tokens';
import { ExamCopyQuestion } from '../infrastructure/database/entities/exam-copy-question.entity';
import { ProfessorFacadeGateway } from '../infrastructure/database/gateways/professor.facade-gateway';

import { StudentController } from './student.controller';

import { ExamCopyQuestionResponse } from '@business/student/infrastructure/database/entities/exam-copy-question-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { ExamCopyTypeormCommandRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-command-repository';
import { ExamCopyTypeormQueryRepository } from '@business/student/infrastructure/database/repositories/exam-copy.typeorm-query-repository';

@Module({
  imports: [ProfessorFacadeModule, TypeOrmModule.forFeature([ExamCopy, ExamCopyQuestion, ExamCopyQuestionResponse])],
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
