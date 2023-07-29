import { TrainingAggregate } from '../aggregates/training.aggregate';

export class TrainingCourseExamDeletedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
