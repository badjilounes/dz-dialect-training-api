import { ExamCopyAggregate } from '@business/training/domain/aggregates/exam-copy.aggregate';

export class ExamCopyCreatedEvent {
  constructor(public examCopy: ExamCopyAggregate) {}
}
