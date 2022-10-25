import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

describe('(StudentController) should-show-presentation', () => {
  const testHelper = initAppTesting('should_show_presentation');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll();
  });

  it('should throw not found error if no training presentation exists', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).get('/student/training/should-show-presentation').expect(HttpStatus.NOT_FOUND);
  });

  it('should be truthy if no exam copy exists for presentation', async () => {
    const { app, fixtures, token } = testHelper();

    await fixtures.training.createTraining();

    const { body } = await request(app.getHttpServer())
      .get('/student/training/should-show-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(body.showPresentation).toBe(true);
  });

  it('should be falsy if an exam copy exists for presentation and is completed', async () => {
    const { app, fixtures, token, userId } = testHelper();

    const training = await fixtures.training.createTraining();
    const copy = await fixtures.examCopy.createExamCopy(userId, { exam: training.exams[0] });
    await fixtures.examCopy.completeCopy(copy.id);

    const { body } = await request(app.getHttpServer())
      .get('/student/training/should-show-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(body.showPresentation).toBe(false);
  });
});
