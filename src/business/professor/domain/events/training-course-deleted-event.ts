import { TrainingAggregate } from '../aggregates/training.aggregate';

export class TrainingCourseDeletedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
