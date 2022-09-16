import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from 'app.module';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';

describe('(TrainingController) get-presentation', () => {
  let app: INestApplication;
  let repository: Repository<Training>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get(DataSource).getRepository(Training);

    await app.init();
  });

  afterEach(() => clearData(repository));

  it('should throw not found error if no training presentation exists', async () => {
    await request(app.getHttpServer()).get('/training/get-presentation').expect(HttpStatus.NOT_FOUND);
  });

  it('should return existing training presentation', async () => {
    await request(app.getHttpServer()).post('/training/create-presentation').expect(HttpStatus.CREATED);

    const { body } = await request(app.getHttpServer()).get('/training/get-presentation').expect(HttpStatus.OK);

    const presentation = await repository.findOne({
      where: { category: TrainingCategoryEnum.PRESENTATION },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

    expect(body).toMatchObject({
      id: presentation?.id,
      category: presentation?.category,
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

async function clearData(repository: Repository<Training>): Promise<void> {
  const presentation = await repository.findOne({ where: { category: TrainingCategoryEnum.PRESENTATION } });
  if (presentation) {
    await repository.delete(presentation.id);
  }
}
