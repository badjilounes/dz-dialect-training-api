import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Command } from '@cqrs/command';

type StartExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

export type StartPresentationCommandResult = {
  id: string;
  name: string;
  trainingId: string;
  questions: StartExamQuestion[];
};

export class StartPresentationCommand extends Command<StartPresentationCommandResult> {}
