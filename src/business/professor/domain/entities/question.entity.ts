import { IsEnum, IsString } from 'class-validator';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamQuestionEntityProps = {
  id: string;
  examId: string;
  type: QuestionTypeEnum;
  question: string;
  answer: AnswerValueType;
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

  private readonly _answer: AnswerValueType;
  public get answer(): AnswerValueType {
    return this._answer;
  }

  @IsString({ each: true })
  private readonly _propositions: string[];
  public get propositions(): string[] {
    return this._propositions;
  }

  private constructor(readonly props: ExamQuestionEntityProps) {
    super();
    this._id = props.id;
    this._examId = props.examId;
    this._type = props.type;
    this._question = props.question;
    this._answer = props.answer;
    this._propositions = props.propositions;
  }

  static create(props: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(props);
  }

  static from(step: ExamQuestionEntityProps): ExamQuestionEntity {
    return new ExamQuestionEntity(step);
  }
}
