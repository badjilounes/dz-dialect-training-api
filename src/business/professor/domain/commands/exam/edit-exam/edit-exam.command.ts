import { QuestionTypeEnum } from '../../../enums/question-type.enum';

import { Command } from '@cqrs/command';

export type EditExamCommandResult = {
  id: string;
  name: string;
  description: string;
  questions: {
    id: string;
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type EditExamCommandPayload = {
  examId: string;
  trainingId: string;
  name: string;
  description: string;
  courseId: string;
  questions: {
    id?: string;
    type: QuestionTypeEnum;
    question: string;
    propositions: string[];
    answer: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export class EditExamCommand extends Command<EditExamCommandResult> {
  constructor(public readonly payload: EditExamCommandPayload) {
    super();
  }
}
