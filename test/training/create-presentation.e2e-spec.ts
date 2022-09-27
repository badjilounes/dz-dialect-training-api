import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { AppModule } from 'app.module';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';

describe('(TrainingController) create-presentation', () => {
  let app: INestApplication;
  let repository: Repository<Training>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get(DataSource).getRepository(Training);

    await app.init();

    await clearData(repository);
  });

  it('should throw conflict error if a training presentation already exist', async () => {
    await request(app.getHttpServer()).post('/training/create-presentation');
    await request(app.getHttpServer()).post('/training/create-presentation').expect(HttpStatus.CONFLICT);
  });

  it('should return created training presentation', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/training/create-presentation')
      .expect(HttpStatus.CREATED);

    const presentation = await repository.findOne({
      where: { id: body.id },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

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

async function clearData(repository: Repository<Training>): Promise<void> {
  const presentations = await repository.find({ where: { category: TrainingCategoryEnum.PRESENTATION } });
  if (presentations.length) {
    await repository.delete(presentations.map((presentation) => presentation.id));
  }
}
