import { InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';

import { ExamCopyNotFoundError } from '../domain/errors/exam-copy-not-found-error';
import { ExamCopyQuestionAlreadyAnsweredError } from '../domain/errors/exam-copy-question-already-answered-error';
import { ExamCopyResponseNotSavedError } from '../domain/errors/exam-copy-response-not-saved-error';

import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamCopyQuestionNotFoundError } from '@business/student/domain/errors/exam-copy-question-not-found-error';
import { TrainingExamNotFoundError } from '@business/student/domain/errors/training-exam-not-found-error';
import { TrainingPresentationExamNotFoundError } from '@business/student/domain/errors/training-presentation-exam-not-found-error';
import { DomainErrorInterceptor } from '@ddd/domain/error/domain-error.interceptor';

export class StudentErrorInterceptor extends DomainErrorInterceptor {
  constructor() {
    super();
    this.register(ExamCopyNotFoundError, (error) => new NotFoundException(error.message));
    this.register(ExamCopyQuestionNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingExamNotFoundError, (error) => new NotFoundException(error.message));
    this.register(TrainingPresentationExamNotFoundError, (error) => new NotFoundException(error.message));

    this.register(ExamCopyNotFinishedError, (error) => new NotAcceptableException(error.message));
    this.register(ExamCopyNotStartedError, (error) => new NotAcceptableException(error.message));
    this.register(ExamCopyQuestionAlreadyAnsweredError, (error) => new NotAcceptableException(error.message));

    this.register(ExamCopyResponseNotSavedError, (error) => new InternalServerErrorException(error.message));
  }
}
