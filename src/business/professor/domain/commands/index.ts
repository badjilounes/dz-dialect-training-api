import { CreateTrainingHandler } from './create-training/create-training.handler';

import { CreateChapterHandler } from '@business/professor/domain/commands/create-chapter/create-chapter.handler';
import { DeleteChapterHandler } from '@business/professor/domain/commands/delete-chapter/delete-chapter.handler';
import { EditChapterHandler } from '@business/professor/domain/commands/edit-chapter/edit-chapter.handler';
import { ReorderChaptersHandler } from '@business/professor/domain/commands/reorder-chapters/reorder-chapters.handler';

export const TrainingCommandHandlers = [
  CreateTrainingHandler,
  CreateChapterHandler,
  EditChapterHandler,
  DeleteChapterHandler,
  ReorderChaptersHandler,
];
