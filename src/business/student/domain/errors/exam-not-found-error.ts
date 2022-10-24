import { DomainError } from '@ddd/domain/error/domain-error';

export class ExamNotFoundError extends DomainError {
  constructor(public examId: string) {
    super();
    this.message = `Exam with id ${examId} not found`;
  }
}
