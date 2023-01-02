import { StartExamHandler } from './start-exam/start-exam.handler';

import { SkipExamHandler } from '@business/student/domain/commands/skip-exam/skip-exam.handler';
import { StartPresentationHandler } from '@business/student/domain/commands/start-presentation/start-presentation.handler';
import { ValidateResponseHandler } from '@business/student/domain/commands/validate-response/validate-response.handler';

export const TrainingCommandHandlers = [
  ValidateResponseHandler,
  StartExamHandler,
  SkipExamHandler,
  StartPresentationHandler,
];
