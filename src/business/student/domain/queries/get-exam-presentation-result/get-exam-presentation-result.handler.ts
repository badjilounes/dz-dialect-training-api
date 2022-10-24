import { Inject } from '@nestjs/common';

import {
  GetExamPresentationResultQuery,
  GetExamPresentationResultQueryResult,
} from './get-exam-presentation-result.query';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamPresentationResultQuery)
export class GetExamPresentationResultQueryHandler implements IQueryHandler<GetExamPresentationResultQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
  ) {}

  async execute(): Promise<GetExamPresentationResultQueryResult> {
    const presentation = await this.trainingQueryRepository.findPresentation();
    if (!presentation) {
      throw new TrainingPresentationNotFoundError();
    }

    const copy = await this.examCopyQueryRepository.findExamCopy(presentation.exams[0].id);
    if (copy?.state !== ExamCopyStateEnum.COMPLETED) {
      throw new ExamCopyNotFinishedError();
    }

    return {
      note: copy.responses.reduce((acc, response) => (response.valid ? acc + 1 : acc), 0),
      total: copy.responses.length,
    };
  }
}
