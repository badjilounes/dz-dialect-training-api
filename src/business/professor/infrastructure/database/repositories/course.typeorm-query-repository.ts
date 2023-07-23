import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { TrainingCourse } from '../entities/training-course.entity';

import { SearchCourseQueryResult } from '@business/professor/domain/queries/search-course/search-course.query';
import { CourseQueryRepository } from '@business/professor/domain/repositories/course-query-repository';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class CourseTypeormQueryRepository extends BaseTypeormQueryRepository implements CourseQueryRepository {
  constructor(
    @InjectRepository(TrainingCourse)
    protected readonly courseRepository: Repository<TrainingCourse>,

    protected readonly context: AppContextService,
  ) {
    super(context);
  }

  async searchCourse(
    trainingId: string,
    pageIndex: number,
    pageSize: number,
    query = '',
  ): Promise<SearchCourseQueryResult> {
    const options: FindManyOptions<TrainingCourse> = {
      where: { training: { id: trainingId } },
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [{ name: ILike(`%${query}%`) }, { description: ILike(`%${query}%`) }];
    }

    const [elements, length] = await this.courseRepository.findAndCount(options);

    return {
      elements,
      length,
      pageIndex,
      pageSize,
    };
  }
}
