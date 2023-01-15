import { Command } from '@cqrs/command';

export class DeleteChapterCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
