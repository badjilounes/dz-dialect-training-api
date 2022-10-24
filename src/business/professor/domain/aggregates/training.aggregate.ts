import { IsEnum, IsString } from 'class-validator';

import { ExamEntity, ExamEntityProps } from '../entities/exam.entity';
import { TrainingCreatedEvent } from '../events/training-created-event';

import { TrainingCategoryEnum } from '@business/professor/domain/enums/training-category.enum';
import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingAggregateProps = {
  id: string;
  category: TrainingCategoryEnum;
  fromLanguage: string;
  learningLanguage: string;
  exams: ExamEntityProps[];
};

export class TrainingAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsEnum(TrainingCategoryEnum)
  private readonly _category: TrainingCategoryEnum;
  public get category(): TrainingCategoryEnum {
    return this._category;
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

  private readonly _exams: ExamEntity[];
  public get exams(): ExamEntity[] {
    return this._exams;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._category = props.category;
    this._fromLanguage = props.fromLanguage;
    this._learningLanguage = props.learningLanguage;
    this._exams = this.props.exams.map(ExamEntity.from);
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
