import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingPresentationExamNotFoundError extends DomainError {
  constructor() {
    super();
    this.message = `Training presentation exam does not exist.`;
  }
}
