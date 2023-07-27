import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

import { ExamCopyQuestionEntity, ExamCopyQuestionEntityProps } from '../entities/exam-copy-question.entity';
import { ExamCopyNotFinishedError } from '../errors/exam-copy-not-finished-error';
import { ExamCopyNotStartedError } from '../errors/exam-copy-not-started-error';
import { ExamCopyCreatedEvent } from '../events/exam-copy-created-event';

import { ExamCopyQuestionResponseEntityProps } from '@business/student/domain/entities/exam-copy-question-response.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyCompletedEvent } from '@business/student/domain/events/exam-copy-completed-event';
import { ExamCopyResponseAddedEvent } from '@business/student/domain/events/exam-copy-response-added-event';
import { ExamCopySkippedEvent } from '@business/student/domain/events/exam-copy-skipped-event';
import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type ExamCopyAggregateProps = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  questions: ExamCopyQuestionEntityProps[];
  currentQuestionIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

export class ExamCopyAggregate extends BaseAggregateRoot {
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

  @IsEnum(ExamCopyStateEnum)
  private _state: ExamCopyStateEnum;
  public get state(): ExamCopyStateEnum {
    return this._state;
  }

  private readonly _questions: ExamCopyQuestionEntity[];
  public get questions(): ExamCopyQuestionEntity[] {
    return this._questions;
  }

  @IsNumber()
  private _currentQuestionIndex: number;
  public get currentQuestionIndex(): number {
    return this._currentQuestionIndex;
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

  private constructor(readonly props: ExamCopyAggregateProps) {
    super();
    this._id = props.id;
    this._examId = props.examId;
    this._state = props.state;
    this._questions = props.questions.map(ExamCopyQuestionEntity.from);
    this._currentQuestionIndex = props.currentQuestionIndex;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ExamCopyAggregateProps): ExamCopyAggregate {
    const examCopy = ExamCopyAggregate.from(props);
    examCopy.apply(new ExamCopyCreatedEvent(examCopy));
    return examCopy;
  }

  static from(examCopy: ExamCopyAggregateProps): ExamCopyAggregate {
    return new ExamCopyAggregate(examCopy);
  }

  writeQuestionResponse(
    question: ExamCopyQuestionEntity,
    props: ExamCopyQuestionResponseEntityProps,
  ): ExamCopyAggregate {
    question.writeResponse(props);

    this._currentQuestionIndex++;
    this._updatedAt = new Date();

    this.apply(new ExamCopyResponseAddedEvent(this));

    if (this.currentQuestionIndex === this.questions.length) {
      this.complete();
    }

    return this;
  }

  complete(): void {
    if (this.state !== ExamCopyStateEnum.IN_PROGRESS) {
      throw new ExamCopyNotStartedError(this.examId);
    }

    if (this.questions.some((q) => !q.response)) {
      throw new ExamCopyNotFinishedError(this.examId);
    }

    this._state = ExamCopyStateEnum.COMPLETED;
    this.apply(new ExamCopyCompletedEvent(this.id));
  }

  skip() {
    if (this.state !== ExamCopyStateEnum.IN_PROGRESS) {
      throw new ExamCopyNotStartedError(this.examId);
    }

    this._state = ExamCopyStateEnum.SKIPPED;
    this.apply(new ExamCopySkippedEvent(this.id));
  }
}
