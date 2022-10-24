import { IsBoolean, IsString } from 'class-validator';

import { ExamQuestionEntity } from './question.entity';

import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ResponseEntityProps = {
  id: string;
  question: ExamQuestionEntity;
  response: AnswerValueType;
};

export class ResponseEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _questionId: string;
  public get questionId(): string {
    return this._questionId;
  }

  private readonly _response: AnswerValueType;
  public get response(): AnswerValueType {
    return this._response;
  }

  private readonly _answer: AnswerValueType;
  public get answer(): AnswerValueType {
    return this._answer;
  }

  @IsBoolean()
  private readonly _valid: boolean;
  public get valid(): boolean {
    return this._valid;
  }

  private constructor(private readonly props: ResponseEntityProps) {
    super();
    this._id = this.props.id;
    this._response = this.props.response;
    this._questionId = this.props.question.id;
    this._answer = this.props.question.answer;
    this._valid = this.props.question.answer.equals(this.props.response);
  }

  static create(props: ResponseEntityProps): ResponseEntity {
    return ResponseEntity.from(props);
  }

  static from(response: ResponseEntityProps): ResponseEntity {
    return new ResponseEntity(response);
  }
}
