import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';

import { Command } from '@cqrs/command';

type StartPresentationExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StartPresentationCommandResult = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  questions: StartPresentationExamQuestion[];
  currentQuestionIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

export class StartPresentationCommand extends Command<StartPresentationCommandResult> {}
