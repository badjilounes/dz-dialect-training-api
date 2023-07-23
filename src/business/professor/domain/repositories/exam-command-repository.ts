import { ExamAggregate } from '../aggregates/exam.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface ExamCommandRepository extends IBaseCommandRepository<ExamAggregate> {
  findByIdList(idList: string[]): Promise<ExamAggregate[]>;
  findExamById(id: string): Promise<ExamAggregate | undefined>;
  findCourseExamByName(trainingId: string, name: string, id?: string): Promise<ExamAggregate | undefined>;
}
