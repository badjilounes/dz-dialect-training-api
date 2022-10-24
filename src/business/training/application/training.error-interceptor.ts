import { ConflictException, NotAcceptableException, NotFoundException } from '@nestjs/common';

import { ExamCopyNotFinishedError } from '@business/training/domain/errors/exam-copy-not-finished-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';
import { QuestionNotFoundError } from 'business/training/domain/errors/question-not-found-error';
import { TrainingPresentationAlreadyExistError } from 'business/training/domain/errors/training-presentation-already-exist-error';
import { TrainingPresentationNotFoundError } from 'business/training/domain/errors/training-presentation-not-found-error';

export class TrainingErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(TrainingPresentationAlreadyExistError, (error) => new ConflictException(error.message));
    this.register(TrainingPresentationNotFoundError, (error) => new NotFoundException(error.message));
    this.register(QuestionNotFoundError, (error) => new NotFoundException(error.message));
    this.register(ExamCopyNotFinishedError, (error) => new NotAcceptableException(error.message));
  }
}
