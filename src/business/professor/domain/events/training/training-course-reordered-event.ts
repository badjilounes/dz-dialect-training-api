import { TrainingAggregate } from '../../aggregates/training.aggregate';

export class TrainingCourseReorderedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
