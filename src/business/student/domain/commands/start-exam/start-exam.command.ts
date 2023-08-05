import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Command } from '@cqrs/command';

type StartExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StartExamCommandResult = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  questions: StartExamQuestion[];
  currentQuestionIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StartExamCommandPayload = {
  examId: string;
};

export class StartExamCommand extends Command<StartExamCommandResult> {
  constructor(public readonly payload: StartExamCommandPayload) {
    super();
  }
}
