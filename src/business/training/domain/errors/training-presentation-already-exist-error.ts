import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingPresentationAlreadyExistError extends DomainError {
  constructor() {
    super();
    this.message = `Training presentation already exist`;
  }
}
