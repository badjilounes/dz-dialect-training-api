import { IsString } from 'class-validator';

import { BaseAggregateRoot } from '../../../../shared/ddd/domain/base-aggregate-root';
import { CourseCreatedEvent } from '../events/course/course-created-event';
import { CourseDeletedEvent } from '../events/course/course-deleted-event';
import { CourseReorderedEvent } from '../events/course/course-reordered-event';
import { CourseUpdatedEvent } from '../events/course/course-updated-event';

import { ExamAggregate, ExamAggregateProps } from './exam.aggregate';

export type UpdateCourseAggregateProps = {
  name: string;
  description: string;
};

export type CourseAggregateProps = {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  exams: ExamAggregateProps[];
};

export class CourseAggregate extends BaseAggregateRoot {
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
  private _name: string;
  public get name(): string {
    return this._name;
  }

  @IsString()
  private _description: string;
  public get description(): string {
    return this._description;
  }

  private readonly _exams: ExamAggregate[];
  public get exams(): ExamAggregate[] {
    return this._exams;
  }

  private constructor(readonly props: CourseAggregateProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._description = props.description;
    this._exams = props.exams.map(ExamAggregate.from);
  }

  static create(props: Omit<CourseAggregateProps, 'exams'>): CourseAggregate {
    const course = CourseAggregate.from({ ...props, exams: [] });
    course.apply(new CourseCreatedEvent(course));
    return course;
  }

  static from(course: CourseAggregateProps): CourseAggregate {
    return new CourseAggregate(course);
  }

  delete(): void {
    this.apply(new CourseDeletedEvent(this.id));
  }

  reorder(order: number): void {
    this.apply(new CourseReorderedEvent(this.id, order));
  }

  update(props: UpdateCourseAggregateProps): CourseAggregate {
    this._name = props.name;
    this._description = props.description;

    this.apply(new CourseUpdatedEvent(this.id, props));

    return this;
  }
}
