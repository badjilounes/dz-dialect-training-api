import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamCopyNotFoundError extends DomainError {
  constructor(public readonly examId: string) {
    super();
    this.message = `Exam copy for exam "${examId}" does not exist`;
  }
}
