import { ExamTypeEnum } from '../../enums/exam-type.enum';

import { Command } from '@cqrs/command';

type CreatePresentationExamQuestion = {
  id: string;
  question: string;
  answer: string;
  propositions: string[];
};

type CreatePresentationExam = {
  id: string;
  name: string;
  type: ExamTypeEnum;
  questions: CreatePresentationExamQuestion[];
};

export type CreatePresentationCommandResult = {
  id: string;
  category: string;
  exam: CreatePresentationExam;
};

export class CreatePresentationCommand extends Command<CreatePresentationCommandResult> {}
