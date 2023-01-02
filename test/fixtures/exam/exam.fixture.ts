import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';

@Injectable()
export class ExamFixture {
  constructor(@InjectRepository(TrainingExam) private readonly repository: Repository<TrainingExam>) {}

  findOneById(id: string): Promise<TrainingExam | null> {
    return this.repository.findOne({
      where: { id },
      order: { questions: { order: 'ASC' } },
      relations: ['training'],
    });
  }
}
