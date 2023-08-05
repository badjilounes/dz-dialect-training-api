import { Inject } from '@nestjs/common';

import { TrainingPresentationExamNotFoundError } from '../../errors/training-presentation-exam-not-found-error';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { GetPresentationExamIdQuery, GetPresentationExamIdQueryResult } from './get-presentation-exam-id.query';

import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetPresentationExamIdQuery)
export class GetPresentationExamIdQueryHandler implements IQueryHandler<GetPresentationExamIdQuery> {
  constructor(
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
  ) {}

  async execute(): Promise<GetPresentationExamIdQueryResult> {
    const presentation = await this.professorGateway.getTrainingPresentation();
    const presentationExam = presentation?.courses?.[0]?.exams?.[0];
    if (!presentationExam) {
      throw new TrainingPresentationExamNotFoundError();
    }

    return {
      examId: presentationExam.id,
    };
  }
}
