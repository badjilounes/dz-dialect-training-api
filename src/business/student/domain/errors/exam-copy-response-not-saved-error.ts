import { DomainError } from '../../../../shared/ddd/domain/error/domain-error';

export class ExamCopyResponseNotSavedError extends DomainError {
  constructor(
    public readonly examCopyId: string,
    public readonly questionId: string,
    public readonly response: string,
  ) {
    super();
    this.message = `Exam copy response "${response}" has not been saved for exam copy id "${examCopyId}", question identifier "${questionId}"`;
  }
}
