import { UpdateTrainingAggregateProps } from '../aggregates/training.aggregate';

export class TrainingUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateTrainingAggregateProps) {}
}
