import { NotAcceptableException, NotFoundException } from '@nestjs/common';

import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { QuestionNotFoundError } from '@business/student/domain/errors/question-not-found-error';
import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class StudentErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationNotFoundError, (error) => new NotFoundException(error.message));
    this.register(QuestionNotFoundError, (error) => new NotFoundException(error.message));
    this.register(ExamCopyNotFinishedError, (error) => new NotAcceptableException(error.message));
  }
}
