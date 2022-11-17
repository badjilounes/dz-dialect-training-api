import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

describe('(TrainingController) start-presentation', () => {
  const testHelper = initAppTesting('start_presentation');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll();
  });

  it('should throw unauthorized error without user nor guest', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).post('/student/training/start-presentation').expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no training presentation exists', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer())
      .post('/student/training/start-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should start presentation', async () => {
    const { app, token, fixtures } = testHelper();

    await fixtures.training.createTraining();

    const { body } = await request(app.getHttpServer())
      .post('/student/training/start-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    expect(body).not.toBeNull();

    const presentation = await fixtures.training.findOneById(body.id);

    expect(body).toMatchObject({
      id: presentation?.id,
      category: presentation?.category,
      exam: {
        id: presentation?.exams[0].id,
        name: presentation?.exams[0].name,
        questions: presentation?.exams[0].questions.map((question) => ({
          id: question.id,
          type: question.type,
          order: question.order,
          question: question.question,
          propositions: question.propositions,
        })),
      },
    });
  });
});
