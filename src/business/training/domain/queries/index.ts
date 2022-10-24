import { GetExamPresentationResultQueryHandler } from '@business/training/domain/queries/get-exam-presentation-result/get-exam-presentation-result.handler';
import { GetPresentationQueryHandler } from 'business/training/domain/queries/get-presentation/get-presentation.handler';

export const TrainingQueryHandlers = [GetPresentationQueryHandler, GetExamPresentationResultQueryHandler];
