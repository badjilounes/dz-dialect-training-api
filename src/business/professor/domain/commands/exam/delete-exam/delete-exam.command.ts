import { Command } from '@cqrs/command';

export class DeleteExamCommand extends Command<void> {
  constructor(public readonly trainingId: string, public readonly courseId: string, public readonly examId: string) {
    super();
  }
}
