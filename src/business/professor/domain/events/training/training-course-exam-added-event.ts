import { TrainingAggregate } from '../../aggregates/training.aggregate';

export class TrainingCourseExamAddedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
