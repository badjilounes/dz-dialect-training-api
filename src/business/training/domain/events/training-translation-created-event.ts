import { TrainingTranslationAggregate } from '../aggregates/training-translation.aggregate';

export class TrainingTranslationCreatedEvent {
  constructor(public training: TrainingTranslationAggregate) {}
}
