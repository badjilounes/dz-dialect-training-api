import { Command } from '@cqrs/command';

export type SkipEPresentationCommandResult = void;

export class SkipPresentationCommand extends Command<SkipEPresentationCommandResult> {
  constructor() {
    super();
  }
}
