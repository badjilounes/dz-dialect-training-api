import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, In, Repository } from 'typeorm';

import { generateUserToken } from '../utils/token.utils';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/training/domain/enums/training-category.enum';
import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { ExamCopyResponse } from '@business/training/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from '@business/training/infrastructure/database/entities/exam-copy.entity';
import { AppModule } from 'app.module';
import { ValidateDto } from 'business/training/application/dto/validate-dto';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';

describe('(TrainingController) validate', () => {
  let app: INestApplication;
  let examCopyRepository: Repository<ExamCopy>;
  let examCopyResponseRepository: Repository<ExamCopyResponse>;
  let trainingRepository: Repository<Training>;

  let validateDto: ValidateDto;
  let training: Training;

  const userId = '1c0cb5de-383e-40bc-8555-57611e8c9cf9';
  const token = generateUserToken(userId);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    examCopyRepository = moduleFixture.get(DataSource).getRepository(ExamCopy);
    examCopyResponseRepository = moduleFixture.get(DataSource).getRepository(ExamCopyResponse);
    trainingRepository = moduleFixture.get(DataSource).getRepository(Training);

    await app.init();

    await clearData(examCopyRepository, trainingRepository);

    validateDto = {
      questionId: '3abb2fa8-d330-486e-963e-47eaefe4c00c',
      examId: '08da1d22-38a3-4681-b663-5846612bfeac',
      trainingId: 'cdcae337-ce85-47db-9ed5-a51630eb39b8',
      response: ['response'],
    };
  });

  it('should throw unauthorized error without user nor guest', async () => {
    await request(app.getHttpServer()).post('/training/validate').send(validateDto).expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw not found error if no question match given question, exam and training identifiers', async () => {
    await request(app.getHttpServer())
      .post('/training/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(validateDto)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should validate the user response', async () => {
    training = await createTraining(trainingRepository);

    validateDto.trainingId = training.id;
    validateDto.examId = training.exams[0].id;
    validateDto.questionId = training.exams[0].questions[0].id;
    validateDto.response = training.exams[0].questions[0].answer;

    const { body } = await request(app.getHttpServer())
      .post('/training/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(validateDto)
      .expect(HttpStatus.CREATED);

    const copyResponse = await examCopyResponseRepository.findOne({
      where: {
        examCopy: { exam: { id: validateDto.examId }, userId },
        question: { id: validateDto.questionId },
      },
    });

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

async function clearData(
  examCopyRepository: Repository<ExamCopy>,
  trainingRepository: Repository<Training>,
): Promise<void> {
  const copyList = await examCopyRepository.find();
  const copyIdList = copyList.map((copy) => copy.id);
  const trainingIdList = copyList.map((copy) => copy.exam.training.id);

  if (copyIdList.length) {
    await examCopyRepository.delete({
      id: In(copyIdList),
    });
  }

  if (trainingIdList.length) {
    await trainingRepository.delete({
      id: In(trainingIdList),
    });
  }
}

async function createTraining(repository: Repository<Training>): Promise<Training> {
  const training = repository.create({
    category: TrainingCategoryEnum.PRESENTATION,
    fromLanguage: 'fr',
    learningLanguage: 'dz',
    exams: [
      {
        name: 'name',
        order: 1,
        questions: [
          {
            type: QuestionTypeEnum.WORD_LIST,
            question: 'question',
            answer: ['answer'],
            propositions: ['proposition'],
            order: 1,
          },
        ],
      },
    ],
  });

  return repository.save(training);
}
