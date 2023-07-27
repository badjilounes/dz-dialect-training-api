import { GetExerciseListQueryHandler } from './get-exercise-list/get-exercise-list.handler';

import { GetExamCopyQueryHandler } from '@business/student/domain/queries/get-exam-copy/get-exam-copy.handler';
import { GetExamResultQueryHandler } from '@business/student/domain/queries/get-exam-result/get-exam-result.handler';

export const TrainingQueryHandlers = [GetExamCopyQueryHandler, GetExamResultQueryHandler, GetExerciseListQueryHandler];
