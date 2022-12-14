import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface ExamCopyCommandRepository extends IBaseCommandRepository<ExamCopyAggregate> {
  findExamCopy(examId: string): Promise<ExamCopyAggregate | undefined>;
}
