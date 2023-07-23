import { Command } from '@cqrs/command';

export type ReorderTrainingsCommandResult = void;

export type ReorderTraining = {
  id: string;
  order: number;
};

export type ReorderTrainingsCommandPayload = ReorderTraining[];

export class ReorderTrainingsCommand extends Command<ReorderTrainingsCommandResult> {
  constructor(public readonly payload: ReorderTrainingsCommandPayload) {
    super();
  }
}
