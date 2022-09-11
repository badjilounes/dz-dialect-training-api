import { TrainingExamAggregate } from '../aggregates/training-exam.aggregate';

export class TrainingExamCreatedEvent {
  constructor(public exam: TrainingExamAggregate) {}
}
