import { IsEnum, IsString } from 'class-validator';

import { ExamCopyCreatedEvent } from '../events/exam-copy-created-event';

import { ResponseEntity, ResponseEntityProps } from '@business/student/domain/entities/response.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyCompletedEvent } from '@business/student/domain/events/exam-copy-completed-event';
import { ExamCopyResponseAddedEvent } from '@business/student/domain/events/exam-copy-response-added-event';
import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type ExamCopyAggregateProps = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  responses: ResponseEntityProps[];
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

  private readonly _responses: ResponseEntity[];
  public get responses(): ResponseEntity[] {
    return this._responses;
  }

  private constructor(private readonly props: ExamCopyAggregateProps) {
    super();
    this._id = props.id;
    this._examId = props.examId;
    this._state = props.state;
    this._responses = this.props.responses.map(ResponseEntity.from);
  }

  static create(props: ExamCopyAggregateProps): ExamCopyAggregate {
    const examCopy = ExamCopyAggregate.from(props);
    examCopy.apply(new ExamCopyCreatedEvent(examCopy));
    return examCopy;
  }

  static from(examCopy: ExamCopyAggregateProps): ExamCopyAggregate {
    return new ExamCopyAggregate(examCopy);
  }

  writeResponse(props: ResponseEntityProps, isLastExamQuestion: boolean): ResponseEntity {
    const response = ResponseEntity.from(props);
    this._responses.push(response);
    this.apply(new ExamCopyResponseAddedEvent(this.id, response));

    if (isLastExamQuestion) {
      this._state = ExamCopyStateEnum.COMPLETED;
      this.apply(new ExamCopyCompletedEvent(this.id));
    }

    return response;
  }
}
