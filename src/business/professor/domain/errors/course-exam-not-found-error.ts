import { DomainError } from '@ddd/domain/error/domain-error';

export class CourseExamNotFoundError extends DomainError {
  constructor(public id: string) {
    super();
    this.message = `Course exam with identifier "${id}" does not exist.`;
  }
}
