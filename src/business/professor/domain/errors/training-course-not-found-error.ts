import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingCourseNotFoundError extends DomainError {
  constructor(public id: string) {
    super();
    this.message = `Training course with identifier "${id}" does not exist.`;
  }
}
