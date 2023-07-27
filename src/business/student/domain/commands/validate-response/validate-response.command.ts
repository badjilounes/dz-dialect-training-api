import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';

import { Command } from '@cqrs/command';

export type ValidateResponseCommandResult = {
  valid: boolean;
  answer: string;
  response: string;
  nextQuestionIndex: number;
  examCopyState: ExamCopyStateEnum;
};

export class ValidateResponseCommand extends Command<ValidateResponseCommandResult> {
  constructor(
    public readonly examCopyId: string,
    public readonly questionId: string,
    public readonly response: string[],
  ) {
    super();
  }
}
