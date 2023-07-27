import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamCopyNotStartedError extends DomainError {
  constructor(public readonly examId: string) {
    super();
    this.message = `Exam copy for exam "${examId}" has not been started yet.`;
  }
}
