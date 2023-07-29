import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchExamQueryHandler } from './search-exam.handler';
import { ExamQueryResult, SearchExamQuery } from './search-exam.query';

describe('Search exam', () => {
  let handler: SearchExamQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let exam: ExamQueryResult;

  let payload: SearchExamQuery;

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new SearchExamQueryHandler(trainingQueryRepository);

    exam = {
      id: 'courseId',
      name: 'examName',
      description: 'examDescription',
      questions: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      courseId: 'trainingId',
      search: 'search',
      pageIndex: 0,
      pageSize: 10,
    };
  });

  it('should return paginated exams corresponding to serach', async () => {
    trainingQueryRepository.searchExam.mockResolvedValue({
      length: 1,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      elements: [exam],
    });

    const result = await handler.execute(payload);

    expect(result.elements).toStrictEqual([exam]);
    expect(result.length).toStrictEqual(1);
    expect(result.pageIndex).toStrictEqual(payload.pageIndex);
    expect(result.pageSize).toStrictEqual(payload.pageSize);
  });
});
