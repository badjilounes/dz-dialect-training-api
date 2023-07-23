import { IsString } from 'class-validator';

import { BaseAggregateRoot } from '../../../../shared/ddd/domain/base-aggregate-root';
import { ExamQuestionEntity, ExamQuestionEntityProps } from '../entities/question.entity';
import { ExamCreatedEvent } from '../events/exam/exam-created-event';
import { ExamDeletedEvent } from '../events/exam/exam-deleted-event';
import { ExamReorderedEvent } from '../events/exam/exam-reordered-event';
import { ExamUpdatedEvent } from '../events/exam/exam-updated-event';

export type UpdateExamAggregateProps = {
  name: string;
  questions: ExamQuestionEntityProps[];
};

export type ExamAggregateProps = {
  id: string;
  courseId: string;
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
  private readonly _courseId: string;
  public get courseId(): string {
    return this._courseId;
  }

  @IsString()
  private _name: string;
  public get name(): string {
    return this._name;
  }

  private _questions: ExamQuestionEntity[];
  public get questions(): ExamQuestionEntity[] {
    return this._questions;
  }

  private constructor(readonly props: ExamAggregateProps) {
    super();
    this._id = props.id;
    this._courseId = props.courseId;
    this._name = props.name;
    this._questions = props.questions.map(ExamQuestionEntity.from);
  }

  static create(props: ExamAggregateProps): ExamAggregate {
    const exam = ExamAggregate.from(props);
    exam.apply(new ExamCreatedEvent(exam));
    return exam;
  }

  static from(exam: ExamAggregateProps): ExamAggregate {
    return new ExamAggregate(exam);
  }

  delete(): void {
    this.apply(new ExamDeletedEvent(this.id));
  }

  reorder(order: number): void {
    this.apply(new ExamReorderedEvent(this.id, order));
  }

  update(props: UpdateExamAggregateProps): ExamAggregate {
    this._name = props.name;
    this._questions = props.questions.map(ExamQuestionEntity.from);

    this.apply(new ExamUpdatedEvent(this.id, props));

    return this;
  }
}
