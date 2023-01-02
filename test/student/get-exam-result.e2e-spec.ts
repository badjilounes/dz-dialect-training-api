import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

describe('(TrainingController) get-exam-result', () => {
  const testHelper = initAppTesting('get_exam_result');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll();
  });

  it('should unauthorized error if no user id can be resolved', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).get('/student/training/get-exam-result').expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no exam exists for given id', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer())
      .get('/student/training/get-exam-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should throw not acceptable error if the exam is not completed', async () => {
    const { app, fixtures, token } = testHelper();

    await fixtures.training.createTraining();

    await request(app.getHttpServer())
      .get('/student/training/get-exam-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_ACCEPTABLE);
  });

  it('should return the exam result', async () => {
    const { app, fixtures, userId, token } = testHelper();

    const copy = await fixtures.examCopy.createExamCopy(userId);
    await fixtures.examCopy.completeCopy(copy.id);

    const { body } = await request(app.getHttpServer())
      .get('/student/training/get-exam-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(body).toMatchObject({
      note: 0,
      total: 0,
    });
  });
});
