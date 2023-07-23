import { Command } from '@cqrs/command';

export class DeleteCourseCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
