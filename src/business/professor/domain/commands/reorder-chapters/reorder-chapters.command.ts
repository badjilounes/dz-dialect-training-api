import { Command } from '@cqrs/command';

export type ReorderChaptersCommandResult = void;

export type ReorderChapter = {
  id: string;
  order: number;
};

export type ReorderChaptersCommandPayload = ReorderChapter[];

export class ReorderChaptersCommand extends Command<ReorderChaptersCommandResult> {
  constructor(public readonly payload: ReorderChaptersCommandPayload) {
    super();
  }
}
