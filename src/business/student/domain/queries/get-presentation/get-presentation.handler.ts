import { Inject } from '@nestjs/common';

import { GetPresentationQuery, GetPresentationQueryResult } from './get-presentation.query';

import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { TRAINING_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetPresentationQuery)
export class GetPresentationQueryHandler implements IQueryHandler<GetPresentationQuery> {
  constructor(
    @Inject(TRAINING_QUERY_REPOSITORY)
    private readonly trainingQueryRepository: TrainingQueryRepository,
  ) {}

  async execute(): Promise<GetPresentationQueryResult> {
    const presentation = await this.trainingQueryRepository.findPresentation();
    if (!presentation) {
      throw new TrainingPresentationNotFoundError();
    }

    return {
      id: presentation.id,
      category: presentation.category,
      exam: {
        id: presentation.exams[0].id,
        name: presentation.exams[0].name,
        questions: presentation.exams[0].questions.map((question) => ({
          id: question.id,
          type: question.type,
          question: question.question,
          propositions: question.propositions,
        })),
      },
    };
  }
}
