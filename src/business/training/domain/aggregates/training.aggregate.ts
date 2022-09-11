import { IsString } from 'class-validator';

import { TrainingCreatedEvent } from '../events/training-created-event';

import { TrainingExamAggregate, TrainingExamAggregateProps } from './training-exam.aggregate';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingAggregateProps = {
  id: string;
  name: string;
  fromLanguage: string;
  learningLanguage: string;
  exams: TrainingExamAggregateProps[];
};

export class TrainingAggregate extends BaseAggregateRoot {
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
  private readonly _fromLanguage: string;
  public get fromLanguage(): string {
    return this._fromLanguage;
  }

  @IsString()
  private readonly _learningLanguage: string;
  public get learningLanguage(): string {
    return this._learningLanguage;
  }

  private readonly _exams: TrainingExamAggregate[];
  public get exams(): TrainingExamAggregate[] {
    return this._exams;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._fromLanguage = props.fromLanguage;
    this._learningLanguage = props.learningLanguage;
    this._exams = this.props.exams.map(TrainingExamAggregate.from);
  }

  static create(props: TrainingAggregateProps): TrainingAggregate {
    const training = TrainingAggregate.from(props);
    training.apply(new TrainingCreatedEvent(training));
    return training;
  }

  static from(exam: TrainingAggregateProps): TrainingAggregate {
    return new TrainingAggregate(exam);
  }
}
