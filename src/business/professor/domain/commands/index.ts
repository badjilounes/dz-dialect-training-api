import { CreateTrainingHandler } from './create-training/create-training.handler';

import { CreateChapterHandler } from '@business/professor/domain/commands/create-chapter/create-chapter.handler';

export const TrainingCommandHandlers = [CreateTrainingHandler, CreateChapterHandler];
