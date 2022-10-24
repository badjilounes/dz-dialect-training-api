import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { TrainingCategoryEnum } from '@business/training/domain/enums/training-category.enum';
import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';

describe('(TrainingController) create-presentation', () => {
  const testHelper = initAppTesting('create_presentation');

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.training.clearAll({ where: { category: TrainingCategoryEnum.PRESENTATION } });
  });

  it('should throw conflict error if a training presentation already exist', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).post('/training/create-presentation');
    await request(app.getHttpServer()).post('/training/create-presentation').expect(HttpStatus.CONFLICT);
  });

  it('should return created training presentation', async () => {
    const { app, fixtures } = testHelper();

    const { body } = await request(app.getHttpServer())
      .post('/training/create-presentation')
      .expect(HttpStatus.CREATED);

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
          question: question.question,
          answer: AnswerValueType.from({ value: question.answer, questionType: question.type }).formattedValue,
          propositions: question.propositions,
        })),
      },
    });
  });
});
