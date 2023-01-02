import { IsString } from 'class-validator';

import { ExamQuestionEntity, ExamQuestionEntityProps } from '../entities/question.entity';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type ExamAggregateProps = {
  id: string;
  trainingId: string;
  name: string;
  questions: ExamQuestionEntityProps[];
};

export class ExamAggregate extends BaseAggregateRoot {
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

  private readonly _questions: ExamQuestionEntity[];
  public get questions(): ExamQuestionEntity[] {
    return this._questions;
  }

  private constructor(private readonly props: ExamAggregateProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._questions = this.props.questions.map(ExamQuestionEntity.from);
  }

  static from(exam: ExamAggregateProps): ExamAggregate {
    return new ExamAggregate(exam);
  }
}
