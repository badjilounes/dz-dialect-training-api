import { IsString } from 'class-validator';

import { BaseEntity } from '@ddd/domain/base-entity';

export type LanguageEntityProps = {
  id: string;
  from: string;
  learning: string;
};

export class LanguageEntity extends BaseEntity {
  @IsString()
  private readonly _id: string;
  public get id(): string {
    return this._id;
  }

  @IsString()
  private readonly _from: string;
  public get from(): string {
    return this._from;
  }

  @IsString()
  private readonly _learning: string;
  public get learning(): string {
    return this._learning;
  }

  private constructor(readonly props: LanguageEntityProps) {
    super();
    this._id = props.id;
    this._from = props.from;
    this._learning = props.learning;
  }

  static create(props: LanguageEntityProps): LanguageEntity {
    return LanguageEntity.from(props);
  }

  static from(course: LanguageEntityProps): LanguageEntity {
    return new LanguageEntity(course);
  }
}
