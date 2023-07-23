import { QuestionTypeEnum } from '../../../enums/question-type.enum';

import { Command } from '@cqrs/command';

export type CreateExamCommandResult = {
  id: string;
  name: string;
  questions: {
    id: string;
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: {
      questionType: QuestionTypeEnum;
      value: string[];
      formattedValue: string;
    };
  }[];
};

export type CreateExamCommandPayload = {
  name: string;
  courseId: string;
  questions: {
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: string[];
  }[];
};

export class CreateExamCommand extends Command<CreateExamCommandResult> {
  constructor(public readonly payload: CreateExamCommandPayload) {
    super();
  }
}