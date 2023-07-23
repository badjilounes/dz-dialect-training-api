import { Command } from '@cqrs/command';

export type EditCourseCommandResult = {
  id: string;
  name: string;
  description: string;
  trainingId: string;
};

export type EditCourseCommandPayload = {
  name: string;
  description: string;
  trainingId: string;
};

export class EditCourseCommand extends Command<EditCourseCommandResult> {
  constructor(public readonly id: string, public readonly payload: EditCourseCommandPayload) {
    super();
  }
}
