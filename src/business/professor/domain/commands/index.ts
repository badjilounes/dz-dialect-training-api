import { CreatePresentationHandler } from './create-presentation/create-presentation.handler';

import { CreateChapterHandler } from '@business/professor/domain/commands/create-chapter/create-chapter.handler';

export const TrainingCommandHandlers = [CreatePresentationHandler, CreateChapterHandler];
