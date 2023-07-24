import { Command } from '@cqrs/command';

export type CreateTrainingCommandResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTrainingCommandPayload = {
  name: string;
  description: string;
  isPresentation: boolean;
};

export class CreateTrainingCommand extends Command<CreateTrainingCommandResult> {
  constructor(public readonly payload: CreateTrainingCommandPayload) {
    super();
  }
}
