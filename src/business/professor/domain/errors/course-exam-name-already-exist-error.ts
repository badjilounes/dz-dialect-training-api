import { DomainError } from '@ddd/domain/error/domain-error';

export class CourseExamNameAlreadyExistError extends DomainError {
  constructor(public courseId: string, public name: string) {
    super();
    this.message = `Course with identifier "${courseId}" has already an exam with the name "${name}".`;
  }
}
