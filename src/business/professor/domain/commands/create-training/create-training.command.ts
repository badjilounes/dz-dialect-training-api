import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { Command } from '@cqrs/command';

type CreateTrainingExamQuestionResult = {
  type: QuestionTypeEnum;
  question: string;
  answer: string;
  propositions: string[];
};

type CreateTrainingExamResult = {
  name: string;
  questions: CreateTrainingExamQuestionResult[];
};

export type CreateTrainingCommandResult = {
  id: string;
  chapterId?: string;
  exams: CreateTrainingExamResult[];
};

type CreateTrainingExamQuestion = {
  type: QuestionTypeEnum;
  question: string;
  answer: string;
  propositions: string[];
};

type CreateTrainingExam = {
  name: string;
  questions: CreateTrainingExamQuestion[];
};

export type CreateTrainingCommandPayload = {
  chapterId?: string;
  exams: CreateTrainingExam[];
};

export class CreateTrainingCommand extends Command<CreateTrainingCommandResult> {
  constructor(public readonly payload: CreateTrainingCommandPayload) {
    super();
  }
}
