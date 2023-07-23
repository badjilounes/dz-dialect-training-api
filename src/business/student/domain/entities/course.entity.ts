import { IsString } from 'class-validator';

import { ExamAggregate, ExamAggregateProps } from '../aggregates/exam.aggregate';

import { BaseEntity } from '@ddd/domain/base-entity';

export type CourseEntityProps = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  exams: ExamAggregateProps[];
};

export class CourseEntity extends BaseEntity {
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

  @IsString()
  private readonly _description: string;
  public get description(): string {
    return this._description;
  }

  private readonly _exams: ExamAggregate[];
  public get exams(): ExamAggregate[] {
    return this._exams;
  }

  private constructor(readonly props: CourseEntityProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._description = props.description;
    this._exams = props.exams.map(ExamAggregate.from);
  }

  static create(props: CourseEntityProps): CourseEntity {
    return CourseEntity.from(props);
  }

  static from(course: CourseEntityProps): CourseEntity {
    return new CourseEntity(course);
  }
}
