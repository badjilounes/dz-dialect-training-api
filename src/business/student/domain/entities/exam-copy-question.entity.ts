import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

import {
  ExamCopyQuestionResponseEntity,
  ExamCopyQuestionResponseEntityProps,
} from './exam-copy-question-response.entity';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamCopyQuestionEntityProps = {
  id: string;
  examCopyId: string;
  examQuestionId: string;
  type: QuestionTypeEnum;
  question: string;
  answer: AnswerValueType;
  propositions: string[];
  response: ExamCopyQuestionResponseEntityProps | undefined;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export class ExamCopyQuestionEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _examCopyId: string;
  public get examCopyId(): string {
    return this._examCopyId;
  }

  @IsString()
  private readonly _examQuestionId: string;
  public get examQuestionId(): string {
    return this._examQuestionId;
  }

  @IsEnum(QuestionTypeEnum)
  private readonly _type: QuestionTypeEnum;
  public get type(): QuestionTypeEnum {
    return this._type;
  }

  @IsString()
  private readonly _question: string;
  public get question(): string {
    return this._question;
  }

  private readonly _answer: AnswerValueType;
  public get answer(): AnswerValueType {
    return this._answer;
  }

  @IsString({ each: true })
  private readonly _propositions: string[];
  public get propositions(): string[] {
    return this._propositions;
  }

  private _response: ExamCopyQuestionResponseEntity | undefined;
  public get response(): ExamCopyQuestionResponseEntity | undefined {
    return this._response;
  }

  @IsNumber()
  private readonly _order: number;
  public get order(): number {
    return this._order;
  }

  @IsDate()
  private readonly _createdAt: Date;
  public get createdAt(): Date {
    return this._createdAt;
  }

  @IsDate()
  private _updatedAt: Date;
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  private constructor(private readonly props: ExamCopyQuestionEntityProps) {
    super();
    this._id = this.props.id;
    this._examCopyId = this.props.examCopyId;
    this._examQuestionId = this.props.examQuestionId;
    this._type = this.props.type;
    this._question = this.props.question;
    this._answer = this.props.answer;
    this._propositions = this.props.propositions;
    this._response = this.props.response && ExamCopyQuestionResponseEntity.from(this.props.response);
    this._order = this.props.order;
    this._createdAt = this.props.createdAt;
    this._updatedAt = this.props.updatedAt;
  }

  static create(props: ExamCopyQuestionEntityProps): ExamCopyQuestionEntity {
    return new ExamCopyQuestionEntity(props);
  }

  static from(step: ExamCopyQuestionEntityProps): ExamCopyQuestionEntity {
    return new ExamCopyQuestionEntity(step);
  }

  writeResponse(props: ExamCopyQuestionResponseEntityProps): ExamCopyQuestionEntity {
    this._response = ExamCopyQuestionResponseEntity.from(props);
    this._updatedAt = new Date();
    return this;
  }
}
