import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

import { CourseEntity, CourseEntityProps, UpdateCourseEntityProps } from '../entities/course.entity';
import { ExamEntity, UpdateExamEntityProps } from '../entities/exam.entity';
import { TrainingCourseAddedEvent } from '../events/training-course-added-event';
import { TrainingCourseDeletedEvent } from '../events/training-course-deleted-event';
import { TrainingCourseExamAddedEvent } from '../events/training-course-exam-added-event';
import { TrainingCourseExamDeletedEvent } from '../events/training-course-exam-deleted-event';
import { TrainingCourseExamReorderedEvent } from '../events/training-course-exam-reordered-event';
import { TrainingCourseExamUpdatedEvent } from '../events/training-course-exam-udpated-event';
import { TrainingCourseUpdatedEvent } from '../events/training-course-updated-event';
import { TrainingCreatedEvent } from '../events/training-created-event';
import { TrainingDeletedEvent } from '../events/training-deleted-event';
import { TrainingReorderedEvent } from '../events/training-reordered-event';
import { TrainingUpdatedEvent } from '../events/training-updated-event';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type UpdateTrainingAggregateProps = {
  name: string;
  description: string;
  isPresentation: boolean;
  updatedAt: Date;
};

export type TrainingAggregateProps = {
  id: string;
  name: string;
  description: string;
  courses: CourseEntityProps[];
  isPresentation: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
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

  private readonly _courses: CourseEntity[];
  public get courses(): CourseEntity[] {
    return this._courses;
  }

  @IsNumber()
  private _order: number;
  public get order(): number {
    return this._order;
  }

  @IsDate()
  private _createdAt: Date;
  public get createdAt(): Date {
    return this._createdAt;
  }

  @IsDate()
  private _updatedAt: Date;
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._courses = this.props.courses.map(CourseEntity.from);
    this._isPresentation = props.isPresentation;
    this._order = props.order;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: TrainingAggregateProps): TrainingAggregate {
    const training = TrainingAggregate.from(props);
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
    this._isPresentation = props.isPresentation;
    this._updatedAt = new Date();

    this.apply(
      new TrainingUpdatedEvent(this.id, {
        name: this.name,
        description: this.description,
        isPresentation: this.isPresentation,
        updatedAt: this.updatedAt,
      }),
    );

    return this;
  }

  addCourse(course: CourseEntity): TrainingAggregate {
    this._courses.push(course);

    this.apply(new TrainingCourseAddedEvent(this));

    return this;
  }

  deleteCourse(courseId: string): TrainingAggregate {
    this._courses.splice(
      this._courses.findIndex((c) => c.id === courseId),
      1,
    );

    this.apply(new TrainingCourseDeletedEvent(this));

    return this;
  }

  updateCourse(course: CourseEntity, props: UpdateCourseEntityProps): TrainingAggregate {
    course.update(props);
    this.apply(new TrainingCourseUpdatedEvent(this));
    return this;
  }

  reorderCourses(newOrders: { id: string; order: number }[]): TrainingAggregate {
    this._courses.forEach((courseToReorder) => {
      const courseWithNewOrder = newOrders.find((current) => current.id === courseToReorder.id);
      this.updateCourse(courseToReorder, {
        name: courseToReorder.name,
        description: courseToReorder.description,
        color: courseToReorder.color,
        order: courseWithNewOrder?.order ?? courseToReorder.order,
      });
    });

    return this;
  }

  addCourseExam(course: CourseEntity, exam: ExamEntity): TrainingAggregate {
    course.addExam(exam);
    this.apply(new TrainingCourseExamAddedEvent(this));
    return this;
  }

  updateCourseExam(course: CourseEntity, exam: ExamEntity, props: UpdateExamEntityProps): TrainingAggregate {
    course.updateExam(exam, props);
    this.apply(new TrainingCourseExamUpdatedEvent(this));
    return this;
  }

  deleteCourseExam(course: CourseEntity, examId: string): TrainingAggregate {
    course.deleteExam(examId);
    this.apply(new TrainingCourseExamDeletedEvent(this));
    return this;
  }

  reorderCourseExams(course: CourseEntity, newOrders: { id: string; order: number }[]): TrainingAggregate {
    course.reorderExams(newOrders);
    this.apply(new TrainingCourseExamReorderedEvent(this));
    return this;
  }
}
