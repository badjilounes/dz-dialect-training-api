import { IsEnum, IsNumber, IsString } from 'class-validator';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamQuestionEntityProps = {
  id: string;
  examId: string;
  type: QuestionTypeEnum;
  question: string;
  answer: AnswerValueType;
  propositions: string[];
  order: number;
};

export class ExamQuestionEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _examId: string;
  public get examId(): string {
    return this._examId;
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

  @IsNumber()
  private readonly _order: number;
  public get order(): number {
    return this._order;
  }

  private constructor(private readonly props: ExamQuestionEntityProps) {
    super();
    this._id = this.props.id;
    this._examId = this.props.examId;
    this._type = this.props.type;
    this._question = this.props.question;
    this._answer = this.props.answer;
    this._propositions = this.props.propositions;
    this._order = this.props.order;
  }

  static create(props: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(props);
  }

  static from(step: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(step);
  }
}
