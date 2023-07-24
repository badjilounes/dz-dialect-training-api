import { Command } from '@cqrs/command';

export class DeleteCourseCommand extends Command<void> {
  constructor(public readonly trainingId: string, public readonly courseId: string) {
    super();
  }
}
