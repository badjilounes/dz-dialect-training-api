import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingNameAlreadyExistError extends DomainError {
  constructor(public name: string) {
    super();
    this.message = `Training with the name "${name}" already exist.`;
  }
}
