import { DomainError } from '@ddd/domain/error/domain-error';

export class TrainingExamNotFoundError extends DomainError {
  constructor(public trainingId: string, public courseId: string, public examId: string) {
    super();
    this.message = `Training exam not found for trainingId: "${trainingId}", courseId: "${courseId}", examId: "${examId}"`;
  }
}
