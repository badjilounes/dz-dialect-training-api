import { GetExamPresentationResultQueryHandler } from '@business/student/domain/queries/get-exam-result/get-exam-result.handler';
import { GetExamQueryHandler } from '@business/student/domain/queries/get-exam/get-exam.handler';
import { GetTrainingChapterListQueryHandler } from '@business/student/domain/queries/get-training-chapter-list/get-training-chapter-list.handler';

export const TrainingQueryHandlers = [
  GetExamQueryHandler,
  GetExamPresentationResultQueryHandler,
  GetTrainingChapterListQueryHandler,
];
