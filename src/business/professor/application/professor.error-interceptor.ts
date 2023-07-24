import { ConflictException, NotFoundException } from '@nestjs/common';

import { TrainingCourseExamNameAlreadyExistError } from '../domain/errors/training-course-exam-name-already-exist-error';
import { TrainingCourseExamNotFoundError } from '../domain/errors/training-course-exam-not-found-error';
import { TrainingNameAlreadyExistError } from '../domain/errors/training-name-already-exist-error';
import { TrainingNotFoundError } from '../domain/errors/training-not-found-error';

import { TrainingCourseNameAlreadyExistError } from '@business/professor/domain/errors/training-course-name-already-exist-error';
import { TrainingCourseNotFoundError } from '@business/professor/domain/errors/training-course-not-found-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class ProfessorErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingNameAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingCourseNameAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingCourseExamNameAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingCourseNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingCourseExamNotFoundError, (error) => new NotFoundException(error.message));
  }
}
