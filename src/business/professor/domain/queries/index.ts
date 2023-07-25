import { GetTrainingByIdQueryHandler } from './get-training-by-id/get-training-by-id.handler';
import { GetTrainingListQueryHandler } from './get-training-list/get-training-list.handler';
import { GetTrainingPresentationQueryHandler } from './get-training-presentation/get-training-presentation.handler';
import { SearchExamQueryHandler } from './search-exam/search-exam.handler';
import { SearchTrainingQueryHandler } from './search-training/search-training.handler';

import { SearchCourseQueryHandler } from '@business/professor/domain/queries/search-course/search-course.handler';

export const ProfessorQueryHandlers = [
  GetTrainingListQueryHandler,
  GetTrainingByIdQueryHandler,
  GetTrainingPresentationQueryHandler,
  SearchCourseQueryHandler,
  SearchTrainingQueryHandler,
  SearchExamQueryHandler,
];
