import { DomainError } from '@ddd/domain/error/domain-error';

export class PresentationExamNotFoundError extends DomainError {
  constructor() {
    super();
    this.message = `Training presentation exam not found`;
  }
}
