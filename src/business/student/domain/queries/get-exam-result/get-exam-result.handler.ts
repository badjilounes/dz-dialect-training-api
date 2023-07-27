import { Inject } from '@nestjs/common';

import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';

import { GetExamResultQuery, GetExamResultQueryResult } from './get-exam-result.query';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamResultQuery)
export class GetExamResultQueryHandler implements IQueryHandler<GetExamResultQuery> {
  constructor(
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
  ) {}

  async execute({ payload }: GetExamResultQuery): Promise<GetExamResultQueryResult> {
    const copy = await this.examCopyQueryRepository.findExamCopyByExamId(payload.examId);
    if (!copy) {
      throw new ExamCopyNotFoundError(payload.examId);
    }

    if (copy.state !== ExamCopyStateEnum.COMPLETED) {
      throw new ExamCopyNotFinishedError(copy.examId);
    }

    return {
      note: copy.questions.reduce((acc, question) => (question.response?.valid ? acc + 1 : acc), 0),
      total: copy.questions.length,
    };
  }
}
