import { IsBoolean, IsString } from 'class-validator';

import { ExamQuestionEntity, QuestionEntityProps } from './question.entity';

import { BaseEntity } from '@ddd/domain/base-entity';

export type ResponseEntityProps = {
  id: string;
  question: QuestionEntityProps;
  response: string;
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

  @IsString()
  private readonly _response: string;
  public get response(): string {
    return this._response;
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
    const question = ExamQuestionEntity.from(this.props.question);
    this._questionId = question.id;
    this._valid = question.answer === this.props.response;
  }

  static create(props: ResponseEntityProps): ResponseEntity {
    return ResponseEntity.from(props);
  }

  static from(response: ResponseEntityProps): ResponseEntity {
    return new ResponseEntity(response);
  }
}
