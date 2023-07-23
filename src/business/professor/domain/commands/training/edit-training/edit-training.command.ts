import { Command } from '@cqrs/command';

export type EditTrainingCommandResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
};

export type EditTrainingCommandPayload = {
  name: string;
  description: string;
  isPresentation: boolean;
};

export class EditTrainingCommand extends Command<EditTrainingCommandResult> {
  constructor(public readonly id: string, public readonly payload: EditTrainingCommandPayload) {
    super();
  }
}
