import { GetExamPresentationResultQueryHandler } from '@business/student/domain/queries/get-exam-result/get-exam-result.handler';
import { GetExamQueryHandler } from '@business/student/domain/queries/get-exam/get-exam.handler';

export const TrainingQueryHandlers = [GetExamQueryHandler, GetExamPresentationResultQueryHandler];
