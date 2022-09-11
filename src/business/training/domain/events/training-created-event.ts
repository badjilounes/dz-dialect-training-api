import { TrainingAggregate } from '../aggregates/training.aggregate';

export class TrainingCreatedEvent {
  constructor(public training: TrainingAggregate) {}
}
