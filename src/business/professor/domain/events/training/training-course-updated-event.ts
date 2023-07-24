import { TrainingAggregate } from '../../aggregates/training.aggregate';

export class TrainingCourseUpdatedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
