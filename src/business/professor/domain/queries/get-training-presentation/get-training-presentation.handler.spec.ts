import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingPresentationQueryHandler } from './get-training-presentation.handler';
import { TrainingPresentationQueryResult } from './get-training-presentation.query';

describe('Get training presentation', () => {
  let handler: GetTrainingPresentationQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: TrainingPresentationQueryResult;

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new GetTrainingPresentationQueryHandler(trainingQueryRepository);

    training = {
      id: 'trainingId',
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: true,
      courses: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should return training corresponding to given identifier', async () => {
    trainingQueryRepository.getTrainingPresentation.mockResolvedValue(training);

    const result = await handler.execute();

    expect(result).toStrictEqual(training);
  });
});
