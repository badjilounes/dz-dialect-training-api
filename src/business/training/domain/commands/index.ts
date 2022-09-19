import { CreatePresentationHandler } from './create-presentation/create-presentation.handler';

import { ValidateResponseHandler } from 'business/training/domain/commands/validate-response/validate-response.handler';

export const TrainingCommandHandlers = [CreatePresentationHandler, ValidateResponseHandler];
