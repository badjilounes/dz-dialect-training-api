import { ConflictException } from '@nestjs/common';

import { TrainingPresentationAlreadyExistError } from '@business/professor/domain/errors/training-presentation-already-exist-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class ProfessorErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationAlreadyExistError, (error) => new ConflictException(error.message));
  }
}
