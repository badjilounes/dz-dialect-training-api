import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingChapterNotFoundError extends DomainError {
  constructor(public id: string) {
    super();
    this.message = `Training chapter id "${id}" does not exist`;
  }
}
