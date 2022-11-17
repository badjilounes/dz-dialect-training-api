import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Command } from '@cqrs/command';

type StartPresentationExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

type StartPresentationExam = {
  id: string;
  name: string;
  questions: StartPresentationExamQuestion[];
};

export type StartPresentationCommandResult = {
  id: string;
  category: string;
  exam: StartPresentationExam;
};

export class StartPresentationCommand extends Command<StartPresentationCommandResult> {
  constructor() {
    super();
  }
}
