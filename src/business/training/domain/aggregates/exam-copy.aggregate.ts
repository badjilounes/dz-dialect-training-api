import { IsString } from 'class-validator';

import { ExamCopyCreatedEvent } from '../events/exam-copy-created-event';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';
import { ResponseEntity, ResponseEntityProps } from 'business/training/domain/entities/response.entity';

export type ExamCopyAggregateProps = {
  id: string;
  examId: string;
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

  private readonly _responses: ResponseEntity[];
  public get responses(): ResponseEntity[] {
    return this._responses;
  }

  private constructor(private readonly props: ExamCopyAggregateProps) {
    super();
    this._id = props.id;
    this._examId = props.examId;
    this._responses = this.props.responses.map(ResponseEntity.from);
  }

  static create(props: ExamCopyAggregateProps): ExamCopyAggregate {
    const examCopy = ExamCopyAggregate.from(props);
    examCopy.apply(new ExamCopyCreatedEvent(examCopy.examId));
    return examCopy;
  }

  static from(examCopy: ExamCopyAggregateProps): ExamCopyAggregate {
    return new ExamCopyAggregate(examCopy);
  }

  writeResponse(props: ResponseEntityProps): ResponseEntity {
    const response = ResponseEntity.from(props);
    this._responses.push(response);
    return response;
  }
}
