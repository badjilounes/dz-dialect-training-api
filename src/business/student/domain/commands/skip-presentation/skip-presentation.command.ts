import { Command } from '@cqrs/command';

export type SkipPresentationCommandResult = void;

export class SkipPresentationCommand extends Command<SkipPresentationCommandResult> {
  constructor() {
    super();
  }
}
