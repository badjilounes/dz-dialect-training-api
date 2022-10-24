import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { Command } from '@cqrs/command';

type CreatePresentationExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  answer: string;
  propositions: string[];
};

type CreatePresentationExam = {
  id: string;
  name: string;
  questions: CreatePresentationExamQuestion[];
};

export type CreatePresentationCommandResult = {
  id: string;
  category: string;
  exam: CreatePresentationExam;
};

export class CreatePresentationCommand extends Command<CreatePresentationCommandResult> {}
