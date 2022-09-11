import { IsString } from 'class-validator';

import { BaseEntity } from '@ddd/domain/base-entity';

export type TrainingExamQuestionEntityProps = {
  id: string;
  examId: string;
  question: string;
  answer: string;
  propositions: string[];
};

export class TrainingExamQuestionEntity extends BaseEntity {
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

  @IsString({ each: true })
  private readonly _propositions: string[];
  public get propositions(): string[] {
    return this._propositions;
  }

  private constructor(private readonly props: TrainingExamQuestionEntityProps) {
    super();
    this._id = this.props.id;
    this._examId = this.props.examId;
    this._question = this.props.question;
    this._answer = this.props.answer;
    this._propositions = this.props.propositions;
  }

  static create(props: TrainingExamQuestionEntityProps): TrainingExamQuestionEntity {
    return new TrainingExamQuestionEntity(props);
  }

  static from(step: TrainingExamQuestionEntityProps): TrainingExamQuestionEntity {
    return new TrainingExamQuestionEntity(step);
  }
}
