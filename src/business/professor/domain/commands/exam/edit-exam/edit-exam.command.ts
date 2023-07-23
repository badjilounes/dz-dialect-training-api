import { QuestionTypeEnum } from '../../../enums/question-type.enum';

import { Command } from '@cqrs/command';

export type EditExamCommandResult = {
  id: string;
  name: string;
  questions: {
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: string[];
  }[];
};

export type EditExamCommandPayload = {
  name: string;
  courseId: string;
  questions: {
    id?: string;
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: string[];
  }[];
};

export class EditExamCommand extends Command<EditExamCommandResult> {
  constructor(public readonly id: string, public readonly payload: EditExamCommandPayload) {
    super();
  }
}
