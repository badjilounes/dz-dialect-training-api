import { IsEnum, IsString } from 'class-validator';

import { ExamTypeEnum } from '../enums/exam-type.enum';

import { ExamQuestionEntity, QuestionEntityProps } from './question.entity';

import { BaseEntity } from '@ddd/domain/base-entity';

export type ExamEntityProps = {
  id: string;
  trainingId: string;
  name: string;
  type: ExamTypeEnum;
  questions: QuestionEntityProps[];
};

export class ExamEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }
  @IsString()
  private readonly _trainingId: string;
  public get trainingId(): string {
    return this._trainingId;
  }

  @IsString()
  private readonly _name: string;
  public get name(): string {
    return this._name;
  }

  @IsEnum(ExamTypeEnum)
  private readonly _type: ExamTypeEnum;
  public get type(): ExamTypeEnum {
    return this._type;
  }

  private readonly _questions: ExamQuestionEntity[];
  public get questions(): ExamQuestionEntity[] {
    return this._questions;
  }

  private constructor(private readonly props: ExamEntityProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._type = ExamTypeEnum.TRANSLATION;
    this._questions = this.props.questions.map(ExamQuestionEntity.from);
  }

  static create(props: ExamEntityProps): ExamEntity {
    return ExamEntity.from(props);
  }

  static from(exam: ExamEntityProps): ExamEntity {
    return new ExamEntity(exam);
  }
}
