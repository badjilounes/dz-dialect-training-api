import { Command } from '@cqrs/command';

export type CreateChapterCommandResult = {
  id: string;
  name: string;
  description: string;
};

export type CreateChapterCommandPayload = {
  name: string;
  description: string;
};

export class CreateChapterCommand extends Command<CreateChapterCommandResult> {
  constructor(public readonly payload: CreateChapterCommandPayload) {
    super();
  }
}
