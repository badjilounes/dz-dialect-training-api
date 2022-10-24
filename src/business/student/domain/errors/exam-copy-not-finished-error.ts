import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamCopyNotFinishedError extends DomainError {
  constructor() {
    super();
    this.message = `Exam copy is not finished`;
  }
}
