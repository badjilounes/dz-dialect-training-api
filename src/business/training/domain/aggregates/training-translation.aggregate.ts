import { IsEnum, IsString } from 'class-validator';

import { TrainingTranslationStepEntity, TrainingTranslationStepEntityProps } from '../entities/training-step.entity';
import { TrainingStateEnum } from '../enums/training-state.enum';
import { TrainingTypeEnum } from '../enums/training-type.enum';
import { TrainingTranslationCreatedEvent } from '../events/training-translation-created-event';

import { BaseAggregateRoot } from 'src/shared/domain/base-aggregate-root';

export type TrainingTranslationAggregateProps = {
  id: string;
  state: TrainingStateEnum;
  steps: TrainingTranslationStepEntityProps[];
};

export class TrainingTranslationAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsEnum(TrainingStateEnum)
  private readonly _state: TrainingStateEnum = TrainingStateEnum.IN_PROGRESS;
  public get state(): TrainingStateEnum {
    return this._state;
  }

  @IsEnum(TrainingTypeEnum)
  private readonly _type: TrainingTypeEnum = TrainingTypeEnum.TRANSLATION;
  public get type(): TrainingTypeEnum {
    return this._type;
  }

  private readonly _steps: TrainingTranslationStepEntity[];
  public get steps(): TrainingTranslationStepEntity[] {
    return this._steps;
  }

  private constructor(private readonly props: TrainingTranslationAggregateProps) {
    super();
    this._id = props.id;
    this._steps = this.props.steps.map(TrainingTranslationStepEntity.from);
    this._state = this.steps.every((step) => step.valid) ? TrainingStateEnum.COMPLETED : TrainingStateEnum.IN_PROGRESS;
  }

  static create(props: TrainingTranslationAggregateProps): TrainingTranslationAggregate {
    const trainingTranslation = TrainingTranslationAggregate.from(props);
    trainingTranslation.apply(new TrainingTranslationCreatedEvent(trainingTranslation));
    return trainingTranslation;
  }

  static from(training: TrainingTranslationAggregateProps): TrainingTranslationAggregate {
    return new TrainingTranslationAggregate(training);
  }
}
