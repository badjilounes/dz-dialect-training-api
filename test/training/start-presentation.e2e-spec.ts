import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from 'app.module';
import { Training } from 'business/training/infrastructure/database/training.entity';

describe('(TrainingController) start-presentation', () => {
  let app: INestApplication;
  let repository: Repository<Training>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get(DataSource).getRepository(Training);
  });

  it('should return created training presentation', async () => {
    const { body } = await request(app.getHttpServer()).post('/training/start-presentation').expect(HttpStatus.CREATED);

    const presentation = await repository.findOne({
      where: { name: 'presentation' },
      relations: ['exams', 'exams.questions'],
    });

    expect(body).toMatchObject({
      id: presentation?.id,
      name: presentation?.name,
      exam: {
        id: presentation?.exams[0].id,
        name: presentation?.exams[0].name,
        type: presentation?.exams[0].type,
        questions: presentation?.exams[0].questions.map((question) => ({
          id: question.id,
          question: question.question,
          answer: question.answer,
          propositions: question.propositions,
        })),
      },
    });
  });
});
