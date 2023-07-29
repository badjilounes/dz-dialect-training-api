import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchCourseQueryHandler } from './search-course.handler';
import { CourseQueryResult, SearchCourseQuery } from './search-course.query';

describe('Search course', () => {
  let handler: SearchCourseQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let course: CourseQueryResult;

  let payload: SearchCourseQuery;

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new SearchCourseQueryHandler(trainingQueryRepository);

    course = {
      id: 'courseId',
      name: 'courseName',
      description: 'courseDescription',
      exams: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      trainingId: 'trainingId',
      search: 'search',
      pageIndex: 0,
      pageSize: 10,
    };
  });

  it('should return paginated courses corresponding to serach', async () => {
    trainingQueryRepository.searchCourse.mockResolvedValue({
      length: 1,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      elements: [course],
    });

    const result = await handler.execute(payload);

    expect(result.elements).toStrictEqual([course]);
    expect(result.length).toStrictEqual(1);
    expect(result.pageIndex).toStrictEqual(payload.pageIndex);
    expect(result.pageSize).toStrictEqual(payload.pageSize);
  });
});
