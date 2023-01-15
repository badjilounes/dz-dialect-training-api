import { ConflictException, NotFoundException } from '@nestjs/common';

import { TrainingChapterNameAlreadyExistError } from '@business/professor/domain/errors/training-chapter-name-already-exist-error';
import { TrainingChapterNotFoundError } from '@business/professor/domain/errors/training-chapter-not-found-error';
import { TrainingPresentationAlreadyExistError } from '@business/professor/domain/errors/training-presentation-already-exist-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class ProfessorErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingChapterNameAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingChapterNotFoundError, (error) => new NotFoundException(error.message));
  }
}
