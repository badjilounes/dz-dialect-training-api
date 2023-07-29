import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetTrainingByIdQueryHandler } from './get-training-by-id.handler';
import { GetTrainingByIdQuery, TrainingByIdQueryResult } from './get-training-by-id.query';

describe('Get training by id', () => {
  let handler: GetTrainingByIdQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: TrainingByIdQueryResult;

  let payload: GetTrainingByIdQuery;
  const trainingId = 'trainingId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new GetTrainingByIdQueryHandler(trainingQueryRepository);

    training = {
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: false,
      courses: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      trainingId,
    };
  });

  it('should return training corresponding to given identifier', async () => {
    trainingQueryRepository.getTrainingById.mockResolvedValue(training);

    const result = await handler.execute(payload);

    expect(result).toStrictEqual(training);
  });
});
