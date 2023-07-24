import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingCourseExamNotFoundError extends DomainError {
  constructor(public examId: string) {
    super();
    this.message = `Course exam with identifier "${examId}" does not exist.`;
  }
}
