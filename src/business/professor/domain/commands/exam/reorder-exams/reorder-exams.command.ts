import { Command } from '@cqrs/command';

export type ReorderCoursesCommandResult = void;

export type ReorderExam = {
  id: string;
  order: number;
};

export type ReorderExamsCommandPayload = ReorderExam[];

export class ReorderExamsCommand extends Command<ReorderCoursesCommandResult> {
  constructor(public readonly payload: ReorderExamsCommandPayload) {
    super();
  }
}
