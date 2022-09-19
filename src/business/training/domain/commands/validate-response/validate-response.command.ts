import { Command } from '@cqrs/command';

export type ValidateResponseCommandResult = {
  valid: boolean;
  answer: string;
  response: string;
};

export class ValidateResponseCommand extends Command<ValidateResponseCommandResult> {
  constructor(
    public readonly trainingId: string,
    public readonly examId: string,
    public readonly questionId: string,
    public readonly response: string,
  ) {
    super();
  }
}
