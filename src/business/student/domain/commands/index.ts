import { StartExamHandler } from './start-exam/start-exam.handler';

import { SkipPrensentationHandler } from '@business/student/domain/commands/skip-presentation/skip-presentation.handler';
import { StartPresentationHandler } from '@business/student/domain/commands/start-presentation/start-presentation.handler';
import { ValidateResponseHandler } from '@business/student/domain/commands/validate-response/validate-response.handler';

export const TrainingCommandHandlers = [
  ValidateResponseHandler,
  StartExamHandler,
  SkipPrensentationHandler,
  StartPresentationHandler,
];
