import { Command } from '@cqrs/command';

export type ReorderCoursesCommandResult = void;

export type ReorderCourse = {
  id: string;
  order: number;
};

export type ReorderCoursesCommandPayload = ReorderCourse[];

export class ReorderCoursesCommand extends Command<ReorderCoursesCommandResult> {
  constructor(public readonly payload: ReorderCoursesCommandPayload) {
    super();
  }
}
