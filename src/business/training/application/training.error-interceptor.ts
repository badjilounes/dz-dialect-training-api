import { ConflictException, NotFoundException } from '@nestjs/common';

import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';
import { TrainingPresentationAlreadyExistError } from 'business/training/domain/errors/training-presentation-already-exist-error';
import { TrainingPresentationNotFoundError } from 'business/training/domain/errors/training-presentation-not-found-error';

export class TrainingErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingPresentationNotFoundError, (error) => new NotFoundException(error.message));
  }
}
