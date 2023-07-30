import { DomainError } from '../../../../shared/ddd/domain/error/domain-error';

export class ExamCopyQuestionAlreadyAnsweredError extends DomainError {
  constructor(public readonly examCopyId: string, public readonly questionId: string) {
    super();
    this.message = `Exam copy with identifier "${examCopyId}" already have an answer to question with identifier "${questionId}"`;
  }
}
