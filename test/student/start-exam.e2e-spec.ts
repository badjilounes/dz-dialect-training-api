import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { StartExamDto } from '@business/student/application/dto/start-exam-dto';

describe('(TrainingController) start-exam', () => {
  const testHelper = initAppTesting('start_exam');

  let payload: StartExamDto;

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll();
  });

  it('should throw unauthorized error without user nor guest', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).post('/student/training/start-exam').send().expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no exam exists for given id', async () => {
    const { app, token } = testHelper();

    payload = {
      examId: '5b1b6f72-9fb3-4157-adb6-e876aa75f65e',
    };

    await request(app.getHttpServer())
      .post('/student/training/start-exam')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should start exam', async () => {
    const { app, token, fixtures } = testHelper();

    const training = await fixtures.training.createTraining();
    const examId = training.exams[0].id;
    payload = { examId };

    const { body } = await request(app.getHttpServer())
      .post('/student/training/start-exam')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    expect(body).not.toBeNull();

    const exam = await fixtures.exam.findOneById(examId);

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
