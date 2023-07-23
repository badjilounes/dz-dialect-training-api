import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingNotFoundError extends DomainError {
  constructor(public id: string) {
    super();
    this.message = `Training with identifier "${id}" does not exist.`;
  }
}
