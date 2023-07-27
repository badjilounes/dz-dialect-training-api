import { IsBoolean, IsDate, IsString } from 'class-validator';

import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamCopyQuestionResponseEntityProps = {
  id: string;
  questionId: string;
  answer: AnswerValueType;
  response: AnswerValueType;
  createdAt: Date;
};

export class ExamCopyQuestionResponseEntity extends BaseEntity {
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

  @IsDate()
  private readonly _createdAt: Date;
  public get createdAt(): Date {
    return this._createdAt;
  }

  private constructor(private readonly props: ExamCopyQuestionResponseEntityProps) {
    super();
    this._id = this.props.id;
    this._response = this.props.response;
    this._questionId = this.props.questionId;
    this._answer = this.props.answer;
    this._valid = this.props.answer.equals(this.props.response);
    this._createdAt = this.props.createdAt;
  }

  static create(props: ExamCopyQuestionResponseEntityProps): ExamCopyQuestionResponseEntity {
    return ExamCopyQuestionResponseEntity.from(props);
  }

  static from(response: ExamCopyQuestionResponseEntityProps): ExamCopyQuestionResponseEntity {
    return new ExamCopyQuestionResponseEntity(response);
  }
}
