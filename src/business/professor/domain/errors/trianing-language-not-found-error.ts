import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingLanguageNotFoundError extends DomainError {
  constructor(public from: string, public learning: string) {
    super();
    this.message = `Training language from "${from}" to "${learning}" does not exist`;
  }
}
