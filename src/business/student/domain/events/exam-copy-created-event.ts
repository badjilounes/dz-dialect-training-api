import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';

export class ExamCopyCreatedEvent {
  constructor(public examCopy: ExamCopyAggregate) {}
}
