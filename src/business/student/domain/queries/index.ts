import { GetExamResultQueryHandler } from '@business/student/domain/queries/get-exam-result/get-exam-result.handler';
import { GetExamCopyQueryHandler } from '@business/student/domain/queries/get-exam-copy/get-exam-copy.handler';

export const TrainingQueryHandlers = [GetExamCopyQueryHandler, GetExamResultQueryHandler];
