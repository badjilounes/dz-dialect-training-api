import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetExamByIdQuery } from '../../domain/queries/get-exam-by-id/get-exam-by-id.query';
import { GetTrainingByIdQuery } from '../../domain/queries/get-training-by-id/get-training-by-id.query';
import { GetTrainingListQuery } from '../../domain/queries/get-training-list/get-training-list.query';
import { GetTrainingPresentationQuery } from '../../domain/queries/get-training-presentation/get-training-presentation.query';

import { ExamFacadeResponse, ProfessorQueryFacade, TrainingFacadeResponse } from './professor.query-facade';

@Injectable()
export class ProfessorQueryBusFacade implements ProfessorQueryFacade {
  constructor(private readonly queryBus: QueryBus) {}

  getTrainingList(): Promise<TrainingFacadeResponse[]> {
    return this.queryBus.execute(new GetTrainingListQuery());
  }

  getTrainingById(trainingId: string): Promise<TrainingFacadeResponse> {
    return this.queryBus.execute(new GetTrainingByIdQuery(trainingId));
  }

  getTrainingPresentation(): Promise<TrainingFacadeResponse> {
    return this.queryBus.execute(new GetTrainingPresentationQuery());
  }

  getExamById(trainingId: string, courseId: string, examId: string): Promise<ExamFacadeResponse> {
    return this.queryBus.execute(new GetExamByIdQuery(trainingId, courseId, examId));
  }
}
