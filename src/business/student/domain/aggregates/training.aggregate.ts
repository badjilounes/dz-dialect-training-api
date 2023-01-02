import { IsOptional, IsString } from 'class-validator';

import { ExamAggregate, ExamAggregateProps } from './exam.aggregate';

import { BaseAggregateRoot } from '@ddd/domain/base-aggregate-root';

export type TrainingAggregateProps = {
  id: string;
  chapterId?: string;
  fromLanguage: string;
  learningLanguage: string;
  exams: ExamAggregateProps[];
};

export class TrainingAggregate extends BaseAggregateRoot {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  @IsOptional()
  private readonly _chapterId: string | undefined;
  public get chapterId(): string | undefined {
    return this._chapterId;
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

  private readonly _exams: ExamAggregate[];
  public get exams(): ExamAggregate[] {
    return this._exams;
  }

  private constructor(private readonly props: TrainingAggregateProps) {
    super();
    this._id = props.id;
    this._chapterId = props.chapterId;
    this._fromLanguage = props.fromLanguage;
    this._learningLanguage = props.learningLanguage;
    this._exams = this.props.exams.map(ExamAggregate.from);
  }

  static from(exam: TrainingAggregateProps): TrainingAggregate {
    return new TrainingAggregate(exam);
  }
}
