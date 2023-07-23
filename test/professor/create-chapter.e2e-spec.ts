import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { initAppTesting } from '../core/setup';

import { CreateCourseDto } from '@business/professor/application/dto/course/create-course-dto';

describe('(TrainingController) professor/training/create-chapter', () => {
  const testHelper = initAppTesting('create_chapter');

  let payload: CreateCourseDto;

  beforeEach(async () => {
    const { fixtures } = testHelper();

    await fixtures.chapter.clearAll();

    payload = {
      name: 'Chapter 1',
      description: 'Chapter 1 description',
      isPresentation: false,
      order: 1,
    };
  });

  it('should throw conflict error if a training chapter already exist for given name', async () => {
    const { app } = testHelper();

    await request(app.getHttpServer())
      .post('/professor/training/create-chapter')
      .send(payload)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/professor/training/create-chapter')
      .send(payload)
      .expect(HttpStatus.CONFLICT);
  });

  it('should return created training chapter', async () => {
    const { app, fixtures } = testHelper();

    const { body } = await request(app.getHttpServer())
      .post('/professor/training/create-chapter')
      .send(payload)
      .expect(HttpStatus.CREATED);

    const chapter = await fixtures.chapter.findOneById(body.id);

    expect(body).toMatchObject({
      id: chapter?.id,
      name: chapter?.name,
      description: chapter?.description,
      isPresentation: chapter?.isPresentation,
      order: chapter?.order,
    });
  });
});
