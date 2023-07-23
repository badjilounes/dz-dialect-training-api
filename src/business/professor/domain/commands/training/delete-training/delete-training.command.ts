import { Command } from '@cqrs/command';

export class DeleteTrainingCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
