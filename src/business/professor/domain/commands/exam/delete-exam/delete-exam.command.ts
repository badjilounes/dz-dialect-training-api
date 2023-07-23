import { Command } from '@cqrs/command';

export class DeleteExamCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
