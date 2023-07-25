import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingCourseExam } from '@business/professor/infrastructure/database/entities/training-course-exam.entity';

@Injectable()
export class ExamFixture {
  constructor(@InjectRepository(TrainingCourseExam) private readonly repository: Repository<TrainingCourseExam>) {}

  findOneById(id: string): Promise<TrainingCourseExam | null> {
    return this.repository.findOne({
      where: { id },
      order: { questions: { order: 'ASC' } },
      relations: ['training'],
    });
  }
}
