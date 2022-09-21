import { IsEnum, IsString } from 'class-validator';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamQuestionEntityProps = {
  id: string;
  examId: string;
  type: QuestionTypeEnum;
  question: string;
  answer: string;
  propositions: string[];
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

  @IsString()
  private readonly _answer: string;
  public get answer(): string {
    return this._answer;
  }

  @IsString({ each: true })
  private readonly _propositions: string[];
  public get propositions(): string[] {
    return this._propositions;
  }

  private constructor(private readonly props: ExamQuestionEntityProps) {
    super();
    this._id = this.props.id;
    this._examId = this.props.examId;
    this._type = this.props.type;
    this._question = this.props.question;
    this._answer = this.props.answer;
    this._propositions = this.props.propositions;
  }

  static create(props: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(props);
  }

  static from(step: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(step);
  }
}
