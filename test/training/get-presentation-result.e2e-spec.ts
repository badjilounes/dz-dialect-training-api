import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';

describe('(TrainingController) get-presentation-result', () => {
  const testHelper = initAppTesting('get_presentation_result');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll({ where: { category: TrainingCategoryEnum.PRESENTATION } });
  });

  it('should unauthorized error if no user id can be resolved', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).get('/training/get-presentation-result').expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no training presentation exists', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer())
      .get('/training/get-presentation-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should throw not acceptable error if the training presentation exam is not completed', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer()).post('/training/create-presentation').expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .get('/training/get-presentation-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_ACCEPTABLE);
  });

  it('should return the training presentation exam result', async () => {
    const { app, fixtures, userId, token } = testHelper();

    const copy = await fixtures.examCopy.createExamCopy(userId);
    await fixtures.examCopy.completeCopy(copy.id);

    const { body } = await request(app.getHttpServer())
      .get('/training/get-presentation-result')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(body).toMatchObject({
      note: 0,
      total: 0,
    });
  });
});
