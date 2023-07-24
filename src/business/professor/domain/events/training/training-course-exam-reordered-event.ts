import { TrainingAggregate } from '../../aggregates/training.aggregate';

export class TrainingCourseExamReorderedEvent {
  constructor(public readonly training: TrainingAggregate) {}
}
