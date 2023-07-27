import { Inject } from '@nestjs/common';

import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';

import { GetExamCopyQuery, GetExamCopyQueryResult } from './get-exam-copy.query';

import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamCopyQuery)
export class GetExamCopyQueryHandler implements IQueryHandler<GetExamCopyQuery> {
  constructor(
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
  ) {}

  async execute({ payload }: GetExamCopyQuery): Promise<GetExamCopyQueryResult> {
    const { examId } = payload;

    const examCopy = await this.examCopyQueryRepository.findExamCopyByExamId(examId);
    if (!examCopy) {
      throw new ExamCopyNotFoundError(examId);
    }

    return {
      id: examCopy.id,
      examId: examCopy.examId,
      state: examCopy.state,
      questions: examCopy.questions.map((question) => ({
        id: question.id,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        response: question.response && {
          id: question.response.id,
          valid: question.response.valid,
          response: question.response.value,
          answer: question.answer,
          createdAt: question.response.createdAt,
        },
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      currentQuestionIndex: examCopy.currentQuestionIndex,
      createdAt: examCopy.createdAt,
      updatedAt: examCopy.updatedAt,
    };
  }
}
