import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingExamNotFoundError extends DomainError {
  constructor(public examId: string) {
    super();
    this.message = `Training exam with identifier "${examId}" does not exist`;
  }
}
