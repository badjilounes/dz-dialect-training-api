import { Command } from '@cqrs/command';

export type EditChapterCommandResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EditChapterCommandPayload = {
  name: string;
  description: string;
  isPresentation: boolean;
};

export class EditChapterCommand extends Command<EditChapterCommandResult> {
  constructor(public readonly id: string, public readonly payload: EditChapterCommandPayload) {
    super();
  }
}
