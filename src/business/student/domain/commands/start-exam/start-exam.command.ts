import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Command } from '@cqrs/command';

type StartExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

export type StartExamCommandResult = {
  id: string;
  name: string;
  trainingId: string;
  questions: StartExamQuestion[];
};

export type StartExamCommandPayload = {
  trainingId: string;
  courseId: string;
  examId: string;
};

export class StartExamCommand extends Command<StartExamCommandResult> {
  constructor(public readonly payload: StartExamCommandPayload) {
    super();
  }
}
