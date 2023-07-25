import { Command } from '@cqrs/command';

export type SkipExamCommandResult = void;

export class SkipExamCommand extends Command<SkipExamCommandResult> {
  constructor(public readonly trainingId: string, public readonly courseId: string, public readonly examId: string) {
    super();
  }
}
