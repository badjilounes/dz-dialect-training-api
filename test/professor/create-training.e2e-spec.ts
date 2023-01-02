import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { CreateTrainingDto } from '@business/professor/application/dto/create-training-dto';
import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';

describe('(TrainingController) professor/create-training', () => {
  const testHelper = initAppTesting('create_training');

  let payload: CreateTrainingDto;

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.training.clearAll();

    payload = {
      exams: [
        {
          name: 'presentation exam',
          questions: [
            {
              type: QuestionTypeEnum.WORD_LIST,
              question: 'el makla rahi el dekhel',
              answer: "la nourriture est à l'intérieur",
              propositions: [
                'part',
                'avec',
                'nous',
                'intérieur',
                'quelque',
                'est',
                'est',
                "l'",
                'nourriture',
                'la',
                'à',
              ],
            },
          ],
        },
      ],
    };
  });

  it('should return created training', async () => {
    const { app, fixtures } = testHelper();

    const { body } = await request(app.getHttpServer())
      .post('/professor/training/create-training')
      .send(payload)
      .expect(HttpStatus.CREATED);

    const training = await fixtures.training.findOneById(body.id);

    expect(body).toMatchObject({
      id: training?.id,
      exams: [
        {
          id: training?.exams[0].id,
          name: training?.exams[0].name,
          questions: training?.exams[0].questions.map((question) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            answer: AnswerValueType.from({ value: question.answer, questionType: question.type }).formattedValue,
            propositions: question.propositions,
          })),
        },
      ],
    });
  });
});
