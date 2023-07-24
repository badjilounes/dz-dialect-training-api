import { IsDate, IsNumber, IsString } from 'class-validator';

import { BaseEntity } from '../../../../shared/ddd/domain/base-entity';

import { ExamQuestionEntity, ExamQuestionEntityProps } from './question.entity';

export type UpdateExamEntityProps = {
  name: string;
  order: number;
  questions: ExamQuestionEntityProps[];
};

export type ExamEntityProps = {
  id: string;
  courseId: string;
  name: string;
  order: number;
  questions: ExamQuestionEntityProps[];
  createdAt: Date;
  updatedAt: Date;
};

export class ExamEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }
  @IsString()
  private readonly _courseId: string;
  public get courseId(): string {
    return this._courseId;
  }

  @IsString()
  private _name: string;
  public get name(): string {
    return this._name;
  }

  @IsNumber()
  private _order: number;
  public get order(): number {
    return this._order;
  }

  private _questions: ExamQuestionEntity[];
  public get questions(): ExamQuestionEntity[] {
    return this._questions;
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

  private constructor(readonly props: ExamEntityProps) {
    super();
    this._id = props.id;
    this._courseId = props.courseId;
    this._name = props.name;
    this._order = props.order;
    this._questions = props.questions.map(ExamQuestionEntity.from);
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ExamEntityProps): ExamEntity {
    return ExamEntity.from(props);
  }

  static from(exam: ExamEntityProps): ExamEntity {
    return new ExamEntity(exam);
  }

  update(props: UpdateExamEntityProps): ExamEntity {
    this._name = props.name;
    this._questions = props.questions.map(ExamQuestionEntity.from);
    this._order = props.order;
    this._updatedAt = new Date();
    return this;
  }
}
