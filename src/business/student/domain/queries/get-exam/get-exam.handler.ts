import { Inject } from '@nestjs/common';

import { GetExamQuery, GetExamQueryResult } from './get-exam.query';

import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY, TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import {
  Exam,
  ExamQuestion,
  TrainingQueryRepository,
} from '@business/student/domain/repositories/training-query-repository';
import { AppContextService } from '@core/context/app-context.service';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamQuery)
export class GetExamQueryHandler implements IQueryHandler<GetExamQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,

    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,

    private readonly context: AppContextService,
  ) {}

  async execute({ payload }: GetExamQuery): Promise<GetExamQueryResult> {
    const exam = await this.trainingQueryRepository.findExamById(payload.examId);
    if (!exam) {
      throw new ExamNotFoundError(payload.examId);
    }

    let resume: ExamQuestion | undefined;

    if (this.context.isUserAuthenticated) {
      const examCopy = await this.examCopyQueryRepository.findExamCopy(payload.examId);
      if (examCopy?.responses.length) {
        resume = this.findNextQuestion(exam, examCopy);
      }
    }

    return {
      id: exam.id,
      name: exam.name,
      resume,
      questions: exam.questions.map((question) => ({
        id: question.id,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
      })),
    };
  }

  private findNextQuestion(exam: Exam, examCopy: ExamCopy): ExamQuestion {
    if (examCopy.responses.length === 0) {
      return exam.questions[0];
    }

    if (examCopy.responses.length === exam.questions.length) {
      return exam.questions[exam.questions.length - 1];
    }

    const latestAnsweredQuestionIndex = exam.questions.findIndex(
      (question) => question.id === examCopy.responses[examCopy.responses.length - 1].questionId,
    );
    return exam.questions[latestAnsweredQuestionIndex + 1];
  }
}
