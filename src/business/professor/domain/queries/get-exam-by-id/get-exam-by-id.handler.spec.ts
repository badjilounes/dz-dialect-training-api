import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingQueryRepository } from '../../repositories/training-query-repository';

import { GetExamByIdQueryHandler } from './get-exam-by-id.handler';
import { GetExamByIdQuery, TrainingCourseExamQueryResult } from './get-exam-by-id.query';

describe('Get exam by id', () => {
  let handler: GetExamByIdQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let exam: TrainingCourseExamQueryResult;

  let payload: GetExamByIdQuery;

  const trainingId = 'trainingId';
  const courseId = 'courseId';
  const examId = 'examId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();

    handler = new GetExamByIdQueryHandler(trainingQueryRepository);

    exam = {
      id: examId,
      name: 'examgName',
      description: 'examDescription',
      questions: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      trainingId,
      courseId,
      examId,
    };
  });

  it('should return exam corresponding to given identifier', async () => {
    trainingQueryRepository.getTrainingCourseExamById.mockResolvedValue(exam);

    const result = await handler.execute(payload);

    expect(result).toStrictEqual(exam);
  });
});
