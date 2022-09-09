import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { BaseEntity } from 'src/shared/domain/base-entity';

export type TrainingTranslationStepEntityProps = {
  id: string;
  question: string;
  answer: string;
  response?: string;
  valid?: boolean;
};

export class TrainingTranslationStepEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _question: string;
  public get question(): string {
    return this._question;
  }

  @IsString()
  private readonly _answer: string;
  public get answer(): string {
    return this._answer;
  }

  @IsString()
  @IsOptional()
  private readonly _response: string | undefined;
  public get response(): string | undefined {
    return this._response;
  }

  @IsBoolean()
  @IsOptional()
  private readonly _valid: boolean | undefined;
  public get valid(): boolean | undefined {
    return this._valid;
  }

  private constructor(private readonly props: TrainingTranslationStepEntityProps) {
    super();
    this._id = this.props.id;
    this._question = this.props.question;
    this._answer = this.props.answer;
    this._response = this.props.response;
    this._valid = this.response && this.response === this.answer;
  }

  static create(props: TrainingTranslationStepEntityProps): TrainingTranslationStepEntity {
    return new TrainingTranslationStepEntity(props);
  }

  static from(step: TrainingTranslationStepEntityProps): TrainingTranslationStepEntity {
    return new TrainingTranslationStepEntity(step);
  }
}
