import { Inject } from '@nestjs/common';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { GetExamQuery, GetExamQueryResult } from './get-exam.query';

import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { Exam, ExamQuestion } from '@business/student/domain/repositories/training-query-repository';
import { AppContextService } from '@core/context/app-context.service';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamQuery)
export class GetExamQueryHandler implements IQueryHandler<GetExamQuery> {
  constructor(
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,

    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,

    private readonly context: AppContextService,
  ) {}

  async execute({ payload }: GetExamQuery): Promise<GetExamQueryResult> {
    const { trainingId, courseId, examId } = payload;
    const exam = await this.professorGateway.getExamById(trainingId, courseId, examId);
    if (!exam) {
      throw new ExamNotFoundError(examId);
    }

    let resume: ExamQuestion | undefined;

    if (this.context.isUserAuthenticated) {
      const examCopy = await this.examCopyQueryRepository.findExamCopy(examId);
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
