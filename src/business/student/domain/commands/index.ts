import { StartPresentationHandler } from './start-presentation/start-presentation.handler';

import { SkipPresentationHandler } from '@business/student/domain/commands/skip-presentation/skip-presentation.handler';
import { ValidateResponseHandler } from '@business/student/domain/commands/validate-response/validate-response.handler';

export const TrainingCommandHandlers = [ValidateResponseHandler, StartPresentationHandler, SkipPresentationHandler];
