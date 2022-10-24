import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ExamCopyFixture } from '../fixtures/exam-copy/exam-copy.fixture';
import { FixtureModule } from '../fixtures/fixture.module';
import { TrainingFixture } from '../fixtures/training/training.fixture';
import { generateUserToken } from '../utils/token.utils';

import { DatabaseOptionsService } from '@core/database/database-options.service';
import { AppModule } from 'app.module';

export type TestingApplication = {
  app: INestApplication;
  fixtures: {
    training: TrainingFixture;
    examCopy: ExamCopyFixture;
  };
  userId: string;
  token: string;
};

export function initAppTesting(dbSchemaName = 'public'): () => TestingApplication {
  let app!: INestApplication;

  let trainingFixture!: TrainingFixture;
  let examCopyFixture!: ExamCopyFixture;

  const userId = '1c0cb5de-383e-40bc-8555-57611e8c9cf9';
  const token = generateUserToken(userId);

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, FixtureModule],
    })
      .overrideProvider(DatabaseOptionsService)
      .useValue(new DatabaseOptionsService(dbSchemaName))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    trainingFixture = moduleFixture.get(TrainingFixture);
    examCopyFixture = moduleFixture.get(ExamCopyFixture);
  });

  afterAll(async () => {
    await app.close();
  });

  return () => ({
    app,
    userId,
    token,
    fixtures: {
      training: trainingFixture,
      examCopy: examCopyFixture,
    },
  });
}
