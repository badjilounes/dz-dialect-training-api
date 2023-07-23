import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingCourseNameAlreadyExistError extends DomainError {
  constructor(public trainingId: string, public name: string) {
    super();
    this.message = `Training with identifier "${trainingId}" has already a course with the name "${name}".`;
  }
}
