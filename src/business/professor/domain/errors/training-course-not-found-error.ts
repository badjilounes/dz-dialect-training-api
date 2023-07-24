import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingCourseNotFoundError extends DomainError {
  constructor(public trainingId: string, public courseId: string) {
    super();
    this.message = `Training with identifier "${trainingId}" does not have any course with identifier "${courseId}".`;
  }
}
