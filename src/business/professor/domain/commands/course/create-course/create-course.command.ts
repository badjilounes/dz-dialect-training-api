import { Command } from '@cqrs/command';

export type CreateCourseCommandResult = {
  id: string;
  name: string;
  description: string;
};

export type CreateCourseCommandPayload = {
  name: string;
  description: string;
  trainingId: string;
};

export class CreateCourseCommand extends Command<CreateCourseCommandResult> {
  constructor(public readonly payload: CreateCourseCommandPayload) {
    super();
  }
}
