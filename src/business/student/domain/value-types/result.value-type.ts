import { IsNumber } from 'class-validator';

import { ExamCopyStateEnum } from '../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../enums/question-type.enum';

import { ValueType } from '@ddd/domain/base-value-type';

export type ExamCopyQuestionResponse = {
  id: string;
  valid: boolean;
  value: string;
  createdAt: Date;
};

export type ExamCopyQuestion = {
  id: string;
  type: QuestionTypeEnum;
  order: number;
  question: string;
  answer: string;
  propositions: string[];
  response: ExamCopyQuestionResponse | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type ResultValueTypeProps = {
  state: ExamCopyStateEnum;
  questions: ExamCopyQuestion[];
};

export class ResultValueType extends ValueType {
  @IsNumber()
  private readonly _score: number;
  public get score(): number {
    return this._score;
  }

  @IsNumber()
  private readonly _maxScore: number;
  public get maxScore(): number {
    return this._maxScore;
  }

  private constructor(readonly props: ResultValueTypeProps) {
    super();
    this._score = props.questions.reduce((acc, question) => (question.response?.valid ? acc + 1 : acc), 0);
    this._maxScore = props.questions.length;
    this.validate();
  }

  static fromCopy(props: ResultValueTypeProps): ResultValueType {
    return new ResultValueType(props);
  }

  equals(vt: ResultValueType): boolean {
    return this.score === vt.score && this.maxScore === vt.maxScore;
  }
}
