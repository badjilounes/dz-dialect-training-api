import { Inject } from '@nestjs/common';

import { GetPresentationQuery, GetPresentationQueryResult } from './get-presentation.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';
import { TrainingPresentationNotFoundError } from 'business/training/domain/errors/training-presentation-not-found-error';
import { TRAINING_QUERY_REPOSITORY } from 'business/training/domain/repositories/tokens';
import { TrainingQueryRepository } from 'business/training/domain/repositories/training-query-repository';

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
        type: presentation.exams[0].type,
        questions: presentation.exams[0].questions.map((question) => ({
          id: question.id,
          question: question.question,
          answer: question.answer,
          propositions: question.propositions,
        })),
      },
    };
  }
}
