import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingPresentationNotFoundError extends DomainError {
  constructor() {
    super();
    this.message = `Training presentation not found`;
  }
}
