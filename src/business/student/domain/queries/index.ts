import { GetExamPresentationResultQueryHandler } from '@business/student/domain/queries/get-exam-presentation-result/get-exam-presentation-result.handler';
import { GetPresentationQueryHandler } from '@business/student/domain/queries/get-presentation/get-presentation.handler';
import { ShouldShowPresentationQueryHandler } from '@business/student/domain/queries/should-show-presentation/should-show-presentation.handler';

export const TrainingQueryHandlers = [
  GetPresentationQueryHandler,
  GetExamPresentationResultQueryHandler,
  ShouldShowPresentationQueryHandler,
];
