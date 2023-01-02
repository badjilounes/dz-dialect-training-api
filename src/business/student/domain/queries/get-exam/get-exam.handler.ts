import { Inject } from '@nestjs/common';

import { GetExamQuery, GetExamQueryResult } from './get-exam.query';

import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExamQuery)
export class GetExamQueryHandler implements IQueryHandler<GetExamQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  async execute({ payload }: GetExamQuery): Promise<GetExamQueryResult> {
    const exam = await this.trainingQueryRepository.findExamById(payload.examId);
    if (!exam) {
      throw new ExamNotFoundError(payload.examId);
    }

    return {
      id: exam.id,
      name: exam.name,
      questions: exam.questions.map((question) => ({
        id: question.id,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
      })),
    };
  }
}
