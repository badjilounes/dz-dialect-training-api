import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

describe('(TrainingController) get-exam', () => {
  const testHelper = initAppTesting('get_exam');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.training.clearAll();
  });

  it('should throw not found error if no exam exists for given id', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).get('/student/training/get-exam').expect(HttpStatus.NOT_FOUND);
  });

  it('should return existing exam', async () => {
    const { app, fixtures } = testHelper();

    await fixtures.training.createTraining();

    const { body } = await request(app.getHttpServer()).get('/student/training/get-exam').expect(HttpStatus.OK);

    const exam = await fixtures.exam.findOneById(body.id);

    expect(body).toMatchObject({
      id: exam?.id,
      name: exam?.name,
      questions: exam?.questions.map((question) => ({
        id: question.id,
        type: question.type,
        order: question.order,
        question: question.question,
        propositions: question.propositions,
      })),
    });
  });
});
