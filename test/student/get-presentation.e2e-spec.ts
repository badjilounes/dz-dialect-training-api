import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';

describe('(TrainingController) get-presentation', () => {
  const testHelper = initAppTesting('get_presentation');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.training.clearAll({ where: { category: TrainingCategoryEnum.PRESENTATION } });
  });

  it('should throw not found error if no training presentation exists', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).get('/student/training/get-presentation').expect(HttpStatus.NOT_FOUND);
  });

  it('should return existing training presentation', async () => {
    const { app, fixtures } = testHelper();

    await fixtures.training.createTraining();

    const { body } = await request(app.getHttpServer()).get('/student/training/get-presentation').expect(HttpStatus.OK);

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
