import { Command } from '@cqrs/command';

export type EditCourseCommandResult = {
  id: string;
  name: string;
  description: string;
  color: string;
  trainingId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type EditCourseCommandPayload = {
  name: string;
  description: string;
  color: string;
  trainingId: string;
};

export class EditCourseCommand extends Command<EditCourseCommandResult> {
  constructor(public readonly courseId: string, public readonly payload: EditCourseCommandPayload) {
    super();
  }
}
