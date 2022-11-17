import { StartPresentationHandler } from './start-presentation/start-presentation.handler';

import { ValidateResponseHandler } from '@business/student/domain/commands/validate-response/validate-response.handler';

export const TrainingCommandHandlers = [ValidateResponseHandler, StartPresentationHandler];
