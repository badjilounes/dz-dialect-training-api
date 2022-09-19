import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';
import { ExamCopyAggregate } from 'business/training/domain/aggregates/exam-copy.aggregate';

export interface ExamCopyCommandRepository extends IBaseCommandRepository<ExamCopyAggregate> {
  findExamCopy(examId: string): Promise<ExamCopyAggregate | undefined>;
}
