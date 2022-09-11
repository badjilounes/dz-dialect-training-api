import { IsEnum, IsString } from 'class-validator';

import { TrainingExamQuestionEntity, TrainingExamQuestionEntityProps } from '../entities/training-exam-question.entity';
import { TrainingExamTypeEnum } from '../enums/training-exam-type.enum';
import { TrainingExamCreatedEvent } from '../events/training-exam-created-event';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingExamAggregateProps = {
  id: string;
  trainingId: string;
  name: string;
  type: TrainingExamTypeEnum;
  questions: TrainingExamQuestionEntityProps[];
};

export class TrainingExamAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }
  @IsString()
  private readonly _trainingId: string;
  public get trainingId(): string {
    return this._trainingId;
  }

  @IsString()
  private readonly _name: string;
  public get name(): string {
    return this._name;
  }

  @IsEnum(TrainingExamTypeEnum)
  private readonly _type: TrainingExamTypeEnum;
  public get type(): TrainingExamTypeEnum {
    return this._type;
  }

  private readonly _questions: TrainingExamQuestionEntity[];
  public get questions(): TrainingExamQuestionEntity[] {
    return this._questions;
  }

  private constructor(private readonly props: TrainingExamAggregateProps) {
    super();
    this._id = props.id;
    this._trainingId = props.trainingId;
    this._name = props.name;
    this._type = TrainingExamTypeEnum.TRANSLATION;
    this._questions = this.props.questions.map(TrainingExamQuestionEntity.from);
  }

  static create(props: TrainingExamAggregateProps): TrainingExamAggregate {
    const trainingTranslation = TrainingExamAggregate.from(props);
    trainingTranslation.apply(new TrainingExamCreatedEvent(trainingTranslation));
    return trainingTranslation;
  }

  static from(exam: TrainingExamAggregateProps): TrainingExamAggregate {
    return new TrainingExamAggregate(exam);
  }
}
