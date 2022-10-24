import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';
import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { Training as TrainingEntity } from '@business/student/infrastructure/database/entities/training.entity';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class TrainingTypeormQueryRepository extends BaseTypeormQueryRepository implements TrainingQueryRepository {
  constructor(
    private readonly context: AppContextService,
    @InjectRepository(TrainingEntity)
    protected readonly repository: Repository<TrainingEntity>,
  ) {
    super(context);
  }

  async findPresentation(): Promise<Training | undefined> {
    const training = await this.repository.findOne({
      where: { category: TrainingCategoryEnum.PRESENTATION },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

    if (!training) {
      return undefined;
    }

    return training;
  }
}
