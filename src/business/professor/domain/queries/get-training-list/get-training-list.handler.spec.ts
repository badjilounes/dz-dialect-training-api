import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingListQueryHandler } from './get-training-list.handler';
import { TrainingQueryResult } from './get-training-list.query';

describe('Get training list', () => {
  let handler: GetTrainingListQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: TrainingQueryResult;

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new GetTrainingListQueryHandler(trainingQueryRepository);

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
  });

  it('should return training list', async () => {
    trainingQueryRepository.getTrainingList.mockResolvedValue([training]);

    const result = await handler.execute();

    expect(result).toStrictEqual([training]);
  });
});
