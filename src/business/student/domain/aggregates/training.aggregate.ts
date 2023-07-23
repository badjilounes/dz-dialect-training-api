import { IsBoolean, IsString } from 'class-validator';

import { CourseEntity, CourseEntityProps } from '../entities/course.entity';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingAggregateProps = {
  id: string;
  name: string;
  description: string;
  courses: CourseEntityProps[];
  isPresentation: boolean;
};

export class TrainingAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
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

  private readonly _courses: CourseEntity[];
  public get courses(): CourseEntity[] {
    return this._courses;
  }

  @IsBoolean()
  private readonly _isPresentation: boolean;
  public get isPresentation(): boolean {
    return this._isPresentation;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._courses = this.props.courses.map(CourseEntity.from);
    this._isPresentation = props.isPresentation;
  }

  static from(exam: TrainingAggregateProps): TrainingAggregate {
    return new TrainingAggregate(exam);
  }
}
