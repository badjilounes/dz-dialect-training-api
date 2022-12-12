import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamCopyNotStartedError extends DomainError {
  constructor() {
    super();
    this.message = `Exam copy is not started`;
  }
}
