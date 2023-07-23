import { CourseAggregate } from '../aggregates/course.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface CourseCommandRepository extends IBaseCommandRepository<CourseAggregate> {
  findByIdList(idList: string[]): Promise<CourseAggregate[]>;
  findCourseById(id: string): Promise<CourseAggregate | undefined>;
  findTrainingCourseByName(trainingId: string, name: string, id?: string): Promise<CourseAggregate | undefined>;
}
