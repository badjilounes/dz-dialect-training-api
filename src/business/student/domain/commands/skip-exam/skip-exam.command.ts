import { Command } from '@cqrs/command';

export type SkipExamCommandResult = void;

export class SkipExamCommand extends Command<SkipExamCommandResult> {
  constructor(public readonly id: string) {
    super();
  }
}
