import { IsBoolean, IsDate, IsString } from 'class-validator';

import { ChapterCreatedEvent } from '../events/chapter-created-event';

import { ChapterDeletedEvent } from '@business/professor/domain/events/chapter-deleted-event';
import { ChapterUpdatedEvent } from '@business/professor/domain/events/chapter-updated-event';
import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type UpdateTrainingChapterAggregateProps = {
  name: string;
  description: string;
  isPresentation: boolean;
};

export type TrainingChapterAggregateProps = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ChapterAggregate extends BaseAggregateRoot {
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

  @IsDate()
  private readonly _createdAt: Date;
  public get createdAt(): Date {
    return this._createdAt;
  }

  @IsDate()
  private readonly _updatedAt: Date;
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  private constructor(private readonly props: TrainingChapterAggregateProps) {
    super();
    this._id = this.props.id;
    this._name = this.props.name;
    this._description = this.props.description;
    this._isPresentation = this.props.isPresentation;
    this._createdAt = this.props.createdAt || new Date();
    this._updatedAt = this.props.updatedAt || new Date();
  }

  static create(props: TrainingChapterAggregateProps): ChapterAggregate {
    const trainingChapter = ChapterAggregate.from(props);
    trainingChapter.apply(new ChapterCreatedEvent(trainingChapter));
    return trainingChapter;
  }

  static from(exam: TrainingChapterAggregateProps): ChapterAggregate {
    return new ChapterAggregate(exam);
  }

  update(payload: UpdateTrainingChapterAggregateProps): ChapterAggregate {
    this._name = payload.name;
    this._description = payload.description;
    this._isPresentation = payload.isPresentation;

    this.apply(new ChapterUpdatedEvent(this.id, payload));

    return this;
  }

  delete(): void {
    this.apply(new ChapterDeletedEvent(this.id));
  }
}
