import { TrainingExamTypeEnum } from '../../enums/training-exam-type.enum';

import { Command } from '@cqrs/command';

type StartPresentationExamQuestion = {
  id: string;
  question: string;
  answer: string;
  propositions: string[];
};

type StartPresentationExam = {
  id: string;
  name: string;
  type: TrainingExamTypeEnum;
  questions: StartPresentationExamQuestion[];
};

export type StartPresentationCommandResult = {
  id: string;
  name: string;
  exam: StartPresentationExam;
};

export class StartPresentationCommand extends Command<StartPresentationCommandResult> {}
