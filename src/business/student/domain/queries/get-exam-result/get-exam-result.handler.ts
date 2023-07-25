import { Inject } from '@nestjs/common';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { GetExamResultQuery, GetExamResultQueryResult } from './get-exam-result.query';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamResultQuery)
export class GetExamResultQueryHandler implements IQueryHandler<GetExamResultQuery> {
  constructor(
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
  ) {}

  async execute({ payload }: GetExamResultQuery): Promise<GetExamResultQueryResult> {
    const { trainingId, courseId, examId } = payload;
    const exam = await this.professorGateway.getExamById(trainingId, courseId, examId);
    if (!exam) {
      throw new ExamNotFoundError(examId);
    }

    const copy = await this.examCopyQueryRepository.findExamCopy(exam.id);
    if (copy?.state !== ExamCopyStateEnum.COMPLETED) {
      throw new ExamCopyNotFinishedError();
    }

    return {
      note: copy.responses.reduce((acc, response) => (response.valid ? acc + 1 : acc), 0),
      total: copy.responses.length,
    };
  }
}
