import { Inject } from '@nestjs/common';

import { GetExamResultQuery, GetExamResultQueryResult } from './get-exam-result.query';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamResultQuery)
export class GetExamPresentationResultQueryHandler implements IQueryHandler<GetExamResultQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
  ) {}

  async execute({ payload }: GetExamResultQuery): Promise<GetExamResultQueryResult> {
    const exam = await this.trainingQueryRepository.findExamById(payload.examId);
    if (!exam) {
      throw new ExamNotFoundError(payload.examId);
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
