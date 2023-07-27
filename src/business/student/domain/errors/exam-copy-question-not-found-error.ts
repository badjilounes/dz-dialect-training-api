import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamCopyQuestionNotFoundError extends DomainError {
  constructor(public readonly examCopyId: string, public questionId: string) {
    super();
    this.message = `Question "${questionId}" not found in exam copy "${examCopyId}"`;
  }
}
