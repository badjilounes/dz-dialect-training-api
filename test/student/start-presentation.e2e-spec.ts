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

    await request(app.getHttpServer())
      .post('/student/training/start-presentation')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no exam exists for given id', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer())
      .post('/student/training/start-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should start exam', async () => {
    const { app, token, fixtures } = testHelper();

    const chapter = await fixtures.chapter.createChapter({ isPresentation: true });
    const training = await fixtures.training.createTraining({ chapter });

    const { body } = await request(app.getHttpServer())
      .post('/student/training/start-presentation')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    expect(body).not.toBeNull();

    const exam = await fixtures.exam.findOneById(training.exams[0].id);

    expect(body).toMatchObject({
      id: exam?.id,
      name: exam?.name,
      trainingId: exam?.training.id,
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
