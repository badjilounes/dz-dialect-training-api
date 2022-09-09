import { TrainingStateEnum } from '../../enums/training-state.enum';
import { TrainingTypeEnum } from '../../enums/training-type.enum';

import {
  GetTrainingForBeVerbLearningQuery,
  GetTrainingForBeVerbLearningQueryResult,
} from './get-training-for-be-verb-learning.query';

import { SentenceClientApiService } from 'src/core/client-api/sentence/sentence-client-api.service';
import { IQueryHandler, QueryHandler } from 'src/shared/cqrs/query';

@QueryHandler(GetTrainingForBeVerbLearningQuery)
export class GetTrainingForBeVerbLearningHandler implements IQueryHandler<GetTrainingForBeVerbLearningQuery> {
  constructor(private readonly sentenceApi: SentenceClientApiService) {}

  async execute(): Promise<GetTrainingForBeVerbLearningQueryResult> {
    const sentences = await this.sentenceApi.getSentences(10);

    return {
      id: '1',
      language: 'fr',
      type: TrainingTypeEnum.TRANSLATION,
      state: TrainingStateEnum.IN_PROGRESS,
      steps: [],
    };
  }
}
