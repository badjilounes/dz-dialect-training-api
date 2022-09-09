import { TrainingStateEnum } from '../../enums/training-state.enum';
import { TrainingTypeEnum } from '../../enums/training-type.enum';

import { Query } from 'src/shared/cqrs/query';

type GetTrainingForBeVerbLearningStep = {
  id: string;
  question: string;
  answer: string;
  response?: string;
  valid?: boolean;
};

export type GetTrainingForBeVerbLearningQueryResult = {
  id: string;
  language: string;
  type: TrainingTypeEnum;
  state: TrainingStateEnum;
  steps: GetTrainingForBeVerbLearningStep[];
};

export class GetTrainingForBeVerbLearningQuery extends Query<GetTrainingForBeVerbLearningQueryResult> {}
