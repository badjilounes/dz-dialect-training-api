import { ExamAggregate } from '../../aggregates/exam.aggregate';

export class TrainingExamCreatedEvent {
  constructor(public exam: ExamAggregate) {}
}
