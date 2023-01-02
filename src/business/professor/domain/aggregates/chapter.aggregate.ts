import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { ChapterCreatedEvent } from '../events/chapter-created-event';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingChapterAggregateProps = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  order: number;
};

export class ChapterAggregate extends BaseAggregateRoot {
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

  @IsBoolean()
  private readonly _isPresentation: boolean;
  public get isPresentation(): boolean {
    return this._isPresentation;
  }

  @IsNumber()
  private readonly _order: number;
  public get order(): number {
    return this._order;
  }

  private constructor(private readonly props: TrainingChapterAggregateProps) {
    super();
    this._id = this.props.id;
    this._name = this.props.name;
    this._description = this.props.description;
    this._isPresentation = this.props.isPresentation;
    this._order = this.props.order;
  }

  static create(props: TrainingChapterAggregateProps): ChapterAggregate {
    const trainingChapter = ChapterAggregate.from(props);
    trainingChapter.apply(new ChapterCreatedEvent(trainingChapter));
    return trainingChapter;
  }

  static from(exam: TrainingChapterAggregateProps): ChapterAggregate {
    return new ChapterAggregate(exam);
  }
}
