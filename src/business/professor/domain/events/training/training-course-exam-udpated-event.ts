import { TrainingAggregate } from '../../aggregates/training.aggregate';

export class TrainingCourseExamUpdatedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
