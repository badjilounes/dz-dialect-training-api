import { SearchExamQueryHandler } from './search-exam/search-exam.handler';
import { SearchTrainingQueryHandler } from './search-training/search-training.handler';

import { SearchCourseQueryHandler } from '@business/professor/domain/queries/search-course/search-course.handler';

export const ProfessorQueryHandlers = [SearchCourseQueryHandler, SearchTrainingQueryHandler, SearchExamQueryHandler];
