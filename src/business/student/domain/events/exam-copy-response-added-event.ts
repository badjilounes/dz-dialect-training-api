import { ExamCopyAggregate } from '../aggregates/exam-copy.aggregate';

export class ExamCopyResponseAddedEvent {
  constructor(public examCopy: ExamCopyAggregate) {}
}
