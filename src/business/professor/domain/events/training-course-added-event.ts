import { TrainingAggregate } from '../aggregates/training.aggregate';

export class TrainingCourseAddedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
