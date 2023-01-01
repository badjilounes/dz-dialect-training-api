import { TrainingChapterAggregate } from '../aggregates/training-category.aggregate';

export class TrainingCategoryCreatedEvent {
  constructor(public training: TrainingChapterAggregate) {}
}
