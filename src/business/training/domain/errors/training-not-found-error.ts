import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingNotFoundError extends DomainError {
  constructor(public trainingId: string) {
    super();
    this.message = `Training with id ${trainingId} not found`;
  }
}
