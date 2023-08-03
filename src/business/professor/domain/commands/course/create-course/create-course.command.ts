import { Command } from '@cqrs/command';

export type CreateCourseCommandResult = {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCourseCommandPayload = {
  name: string;
  description: string;
  color: string;
  trainingId: string;
};

export class CreateCourseCommand extends Command<CreateCourseCommandResult> {
  constructor(public readonly payload: CreateCourseCommandPayload) {
    super();
  }
}
