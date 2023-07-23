import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { SearchTrainingQueryResult } from '../../../domain/queries/search-training/search-training.query';
import { TrainingQueryRepository } from '../../../domain/repositories/training-query-repository';
import { Training } from '../entities/training.entity';

import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class TrainingTypeormQueryRepository extends BaseTypeormQueryRepository implements TrainingQueryRepository {
  constructor(
    @InjectRepository(Training)
    protected readonly trainingRepository: Repository<Training>,

    protected readonly context: AppContextService,
  ) {
    super(context);
  }

  async searchTraining(pageIndex: number, pageSize: number, query = ''): Promise<SearchTrainingQueryResult> {
    const options: FindManyOptions<Training> = {
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [
        { name: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
        { courses: { name: ILike(`%${query}%`) } },
        { courses: { description: ILike(`%${query}%`) } },
      ];
    }

    const [elements, length] = await this.trainingRepository.findAndCount(options);

    return {
      elements,
      length,
      pageIndex,
      pageSize,
    };
  }
}
