import { IsString } from 'class-validator';

import { TrainingCategoryCreatedEvent } from '../events/training-category-created-event';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingChapterAggregateProps = {
  id: string;
  name: string;
  description: string;
};

export class TrainingChapterAggregate extends BaseAggregateRoot {
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

  private constructor(private readonly props: TrainingChapterAggregateProps) {
    super();
    this._id = this.props.id;
    this._name = this.props.name;
    this._description = this.props.description;
  }

  static create(props: TrainingChapterAggregateProps): TrainingChapterAggregate {
    const trainingChapter = TrainingChapterAggregate.from(props);
    trainingChapter.apply(new TrainingCategoryCreatedEvent(trainingChapter));
    return trainingChapter;
  }

  static from(exam: TrainingChapterAggregateProps): TrainingChapterAggregate {
    return new TrainingChapterAggregate(exam);
  }
}
