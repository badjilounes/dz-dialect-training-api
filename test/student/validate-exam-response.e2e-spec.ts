import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { Training } from '@business/professor/infrastructure/database/entities/training.entity';
import { ValidateExamResponseDto } from '@business/student/application/dto/validate-exam-response-dto';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';

describe('(TrainingController) validate-exam-response', () => {
  const testHelper = initAppTesting('validate_exam_response');

  let validateDto: ValidateExamResponseDto;
  let training: Training;

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

    await request(app.getHttpServer())
      .post('/student/training/validate-exam-response')
      .send(validateDto)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no question match given question, exam and training identifiers', async () => {
    const { app, token } = testHelper();

    await request(app.getHttpServer())
      .post('/student/training/validate-exam-response')
      .set('Authorization', `Bearer ${token}`)
      .send(validateDto)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should validate the user response', async () => {
    const { app, token, userId, fixtures } = testHelper();

    training = await fixtures.training.createTraining();

    await fixtures.examCopy.createExamCopy(userId, { exam: { id: training.exams[0].id } });

    validateDto.trainingId = training.id;
    validateDto.examId = training.exams[0].id;
    validateDto.questionId = training.exams[0].questions[0].id;
    validateDto.response = training.exams[0].questions[0].answer;

    const { body } = await request(app.getHttpServer())
      .post('/student/training/validate-exam-response')
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
