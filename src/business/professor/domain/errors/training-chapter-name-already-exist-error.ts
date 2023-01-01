import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingChapterNameAlreadyExistError extends DomainError {
  constructor(public name: string) {
    super();
    this.message = `Training chapter name "${name}" already exist`;
  }
}
