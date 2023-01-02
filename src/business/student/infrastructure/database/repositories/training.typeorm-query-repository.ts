import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Exam,
  Training,
  TrainingQueryRepository,
} from '@business/student/domain/repositories/training-query-repository';
import { Chapter } from '@business/student/infrastructure/database/entities/chapter.entity';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';
import { Training as TrainingEntity } from '@business/student/infrastructure/database/entities/training.entity';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class TrainingTypeormQueryRepository extends BaseTypeormQueryRepository implements TrainingQueryRepository {
  constructor(
    private readonly context: AppContextService,

    @InjectRepository(TrainingEntity)
    protected readonly repository: Repository<TrainingEntity>,

    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    @InjectRepository(Chapter)
    protected readonly chapterRepository: Repository<Chapter>,
  ) {
    super(context);
  }

  findChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find({ order: { order: 'ASC' } });
  }

  findTrainingsByChapterId(chapterId: string): Promise<Training[]> {
    return this.repository.find({
      where: { chapter: { id: chapterId } },
      order: { createdAt: 'ASC' },
    });
  }

  async findTrainingById(id: string): Promise<Training | undefined> {
    const training = await this.repository.findOne({
      where: { id },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

    if (!training) {
      return undefined;
    }

    return training;
  }

  async findExamById(id: string): Promise<Exam | undefined> {
    const exam = await this.examRepository.findOne({
      where: { id },
      order: { questions: { order: 'ASC' } },
    });

    if (!exam) {
      return undefined;
    }

    return exam;
  }
}
