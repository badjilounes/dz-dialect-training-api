import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { SearchTrainingQueryHandler } from './search-training.handler';
import { SearchTrainingQuery, TrainingQueryResult } from './search-training.query';

describe('Search training', () => {
  let handler: SearchTrainingQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: TrainingQueryResult;

  let payload: SearchTrainingQuery;

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new SearchTrainingQueryHandler(trainingQueryRepository);

    training = {
      id: 'trainingId',
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      search: 'search',
      pageIndex: 0,
      pageSize: 10,
    };
  });

  it('should return paginated trainings corresponding to serach', async () => {
    trainingQueryRepository.searchTraining.mockResolvedValue({
      length: 1,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      elements: [training],
    });

    const result = await handler.execute(payload);

    expect(result.elements).toStrictEqual([training]);
    expect(result.length).toStrictEqual(1);
    expect(result.pageIndex).toStrictEqual(payload.pageIndex);
    expect(result.pageSize).toStrictEqual(payload.pageSize);
  });
});
