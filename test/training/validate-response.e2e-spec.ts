import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';
import { generateUserToken } from '../utils/token.utils';

import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { ValidateDto } from 'business/training/application/dto/validate-dto';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';

describe('(TrainingController) validate', () => {
  const testHelper = initAppTesting();

  let validateDto: ValidateDto;
  let training: Training;

  const userId = '1c0cb5de-383e-40bc-8555-57611e8c9cf9';
  const token = generateUserToken(userId);

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.examCopy.clearAll();
    await fixtures.training.clearAll();

    validateDto = {
      questionId: '3abb2fa8-d330-486e-963e-47eaefe4c00c',
      examId: '08da1d22-38a3-4681-b663-5846612bfeac',
      trainingId: 'cdcae337-ce85-47db-9ed5-a51630eb39b8',
      response: ['response'],
    };
  });

  it('should throw unauthorized error without user nor guest', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer()).post('/training/validate').send(validateDto).expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no question match given question, exam and training identifiers', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer())
      .post('/training/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(validateDto)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should validate the user response', async () => {
    const { app, fixtures } = testHelper();

    training = await fixtures.training.createTraining();

    validateDto.trainingId = training.id;
    validateDto.examId = training.exams[0].id;
    validateDto.questionId = training.exams[0].questions[0].id;
    validateDto.response = training.exams[0].questions[0].answer;

    const { body } = await request(app.getHttpServer())
      .post('/training/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(validateDto)
      .expect(HttpStatus.CREATED);

    const copyResponse = await fixtures.examCopy.findUserResponse(validateDto.examId, validateDto.questionId, userId);

    expect(copyResponse).not.toBeNull();

    expect(body).toMatchObject({
      valid: copyResponse?.valid,
      response: AnswerValueType.from({
        value: copyResponse?.response ?? [],
        questionType: training.exams[0].questions[0].type,
      }).formattedValue,
      answer: body.answer,
    });
  });
});
