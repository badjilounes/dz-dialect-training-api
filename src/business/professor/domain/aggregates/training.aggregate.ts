import { IsBoolean, IsString } from 'class-validator';

import { TrainingCreatedEvent } from '../events/training/training-created-event';
import { TrainingDeletedEvent } from '../events/training/training-deleted-event';
import { TrainingReorderedEvent } from '../events/training/training-reordered-event';
import { TrainingUpdatedEvent } from '../events/training/training-updated-event';

import { CourseAggregate, CourseAggregateProps } from './course.aggregate';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type UpdateTrainingAggregateProps = {
  name: string;
  description: string;
  isPresentation: boolean;
};

export type TrainingAggregateProps = {
  id: string;
  name: string;
  description: string;
  courses: CourseAggregateProps[];
  isPresentation: boolean;
};

export class TrainingAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private _name: string;
  public get name(): string {
    return this._name;
  }

  @IsString()
  private _description: string;
  public get description(): string {
    return this._description;
  }

  @IsBoolean()
  private _isPresentation: boolean;
  public get isPresentation(): boolean {
    return this._isPresentation;
  }

  private readonly _courses: CourseAggregate[];
  public get courses(): CourseAggregate[] {
    return this._courses;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._courses = this.props.courses.map(CourseAggregate.from);
    this._isPresentation = props.isPresentation;
  }

  static create(props: Omit<TrainingAggregateProps, 'courses'>): TrainingAggregate {
    const training = TrainingAggregate.from({ ...props, courses: [] });
    training.apply(new TrainingCreatedEvent(training));
    return training;
  }

  static from(exam: TrainingAggregateProps): TrainingAggregate {
    return new TrainingAggregate(exam);
  }

  delete(): void {
    this.apply(new TrainingDeletedEvent(this.id));
  }

  reorder(order: number): void {
    this.apply(new TrainingReorderedEvent(this.id, order));
  }

  update(props: UpdateTrainingAggregateProps): TrainingAggregate {
    this._name = props.name;
    this._description = props.description;

    this.apply(new TrainingUpdatedEvent(this.id, props));

    return this;
  }
}
