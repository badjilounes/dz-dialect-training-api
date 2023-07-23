import { ExamAggregate } from '../../aggregates/exam.aggregate';

export class ExamCreatedEvent {
  constructor(public exam: ExamAggregate) {}
}
