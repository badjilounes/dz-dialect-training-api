import { NotAcceptableException, NotFoundException } from '@nestjs/common';

import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { PresentationExamNotFoundError } from '@business/student/domain/errors/exam-presentation-not-found-error';
import { QuestionNotFoundError } from '@business/student/domain/errors/question-not-found-error';
import { TrainingNotFoundError } from '@business/student/domain/errors/training-not-found-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class StudentErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(QuestionNotFoundError, (error) => new NotFoundException(error.message));
    this.register(ExamNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingNotFoundError, (error) => new NotFoundException(error.message));
    this.register(PresentationExamNotFoundError, (error) => new NotFoundException(error.message));
    this.register(ExamCopyNotFinishedError, (error) => new NotAcceptableException(error.message));
    this.register(ExamCopyNotStartedError, (error) => new NotAcceptableException(error.message));
  }
}
