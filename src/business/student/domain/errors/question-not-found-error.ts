import { DomainError } from '@ddd/domain/error/domain-error';

export class QuestionNotFoundError extends DomainError {
  constructor(public questionId: string) {
    super();
    this.message = `Question with id ${questionId} not found`;
  }
}
