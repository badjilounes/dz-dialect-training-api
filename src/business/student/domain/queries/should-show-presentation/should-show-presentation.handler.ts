import { Inject } from '@nestjs/common';

import { ShouldShowPresentationQuery, ShouldShowPresentationResult } from './should-show-presentation.query';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { AppContextService } from '@core/context/app-context.service';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(ShouldShowPresentationQuery)
export class ShouldShowPresentationQueryHandler implements IQueryHandler<ShouldShowPresentationQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
    private readonly context: AppContextService,
  ) {}

  async execute(): Promise<ShouldShowPresentationResult> {
    const presentation = await this.trainingQueryRepository.findPresentation();
    if (!presentation) {
      throw new TrainingPresentationNotFoundError();
    }

    const examCopy = await this.examCopyQueryRepository.findExamCopy(presentation.exams[0].id);
    if (!examCopy) {
      return true;
    }

    if (examCopy) {
      return examCopy.state === ExamCopyStateEnum.IN_PROGRESS;
    }

    return false;
  }
}
