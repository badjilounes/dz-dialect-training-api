import { Inject } from '@nestjs/common';

import { GetTrainingChapterListQuery, GetTrainingChapterListQueryResult } from './get-training-chapter-list.query';

import { TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetTrainingChapterListQuery)
export class GetTrainingChapterListQueryHandler implements IQueryHandler<GetTrainingChapterListQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  async execute(): Promise<GetTrainingChapterListQueryResult[]> {
    // const chapters = await this.trainingQueryRepository.findChapters();

    // return Promise.all(
    //   chapters.map(async (chapter) => ({
    //     chapter,
    //     trainingList: await this.trainingQueryRepository.findCoursesByTrainingId(chapter.id),
    //   })),
    // );

    return [];
  }
}
