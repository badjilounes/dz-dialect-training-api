import { Inject } from '@nestjs/common';

import { ProfessorQueryFacade } from '../../../../professor/application/facade/professor.query-facade';
import { PROFESSOR_QUERY_FACADE_TOKEN } from '../../../../professor/application/facade/tokens';
import { Exam, ProfessorGateway, Training, TrainingListFilter } from '../../../domain/gateways/professor-gateway';

export class ProfessorFacadeGateway implements ProfessorGateway {
  constructor(
    @Inject(PROFESSOR_QUERY_FACADE_TOKEN)
    private readonly professorQueryFacade: ProfessorQueryFacade,
  ) {}

  getTraingList(filter?: TrainingListFilter): Promise<Training[]> {
    return this.professorQueryFacade.getTrainingList(filter);
  }

  getTrainingById(trainingId: string): Promise<Training | null> {
    return this.professorQueryFacade.getTrainingById(trainingId);
  }

  getTrainingPresentation(): Promise<Training | null> {
    return this.professorQueryFacade.getTrainingPresentation();
  }

  getExamById(examId: string): Promise<Exam | null> {
    return this.professorQueryFacade.getExamById(examId);
  }
}
