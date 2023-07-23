import { ConflictException, NotFoundException } from '@nestjs/common';

import { TrainingNotFoundError } from '../domain/errors/training-not-found-error';

import { TrainingCourseNameAlreadyExistError } from '@business/professor/domain/errors/training-course-name-already-exist-error';
import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { TrainingPresentationAlreadyExistError } from '@business/professor/domain/errors/training-presentation-already-exist-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class ProfessorErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingCourseNameAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingCourseNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingNotFoundError, (error) => new NotFoundException(error.message));
  }
}
