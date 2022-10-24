import { IsEnum } from 'class-validator';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ValueType } from '@ddd/domain/base-value-type';

export type AnswerValueTypeProps = {
  questionType: QuestionTypeEnum;
  value: string[];
  formattedValue: string;
};

export type SingleChoiceValueTypeProps = {
  value: string[];
};

export type MultipleChoiceValueTypeProps = {
  value: string[];
};

export type WordListValueTypeProps = {
  value: string[];
};

export type AnswerValueTypeFromProps = {
  questionType: QuestionTypeEnum;
  value: string[];
};

export class AnswerValueType extends ValueType {
  @IsEnum(QuestionTypeEnum)
  private readonly _questionType: QuestionTypeEnum;
  public get questionType(): QuestionTypeEnum {
    return this._questionType;
  }

  private readonly _value: string[];
  public get value(): string[] {
    return this._value;
  }

  private readonly _formattedValue: string;
  public get formattedValue(): string {
    return this._formattedValue;
  }

  private constructor(private props: AnswerValueTypeProps) {
    super();
    this._questionType = this.props.questionType;
    this._value = this.props.value;
    this._formattedValue = this.props.formattedValue;
    this.validate();
  }

  static from(props: AnswerValueTypeFromProps): AnswerValueType {
    switch (props.questionType) {
      case QuestionTypeEnum.SINGLE_CHOICE:
        return AnswerValueType.createSingleChoice(props);
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return AnswerValueType.createMultipleChoice(props);
      case QuestionTypeEnum.WORD_LIST:
        return AnswerValueType.createWordList(props);
      default:
        throw new Error('Invalid question type');
    }
  }

  static createSingleChoice(props: SingleChoiceValueTypeProps): AnswerValueType {
    return new AnswerValueType({
      questionType: QuestionTypeEnum.SINGLE_CHOICE,
      value: props.value,
      formattedValue: props.value.join(),
    });
  }

  static createMultipleChoice(props: MultipleChoiceValueTypeProps): AnswerValueType {
    return new AnswerValueType({
      questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
      value: props.value,
      formattedValue: props.value.join(', '),
    });
  }

  static createWordList(props: WordListValueTypeProps): AnswerValueType {
    return new AnswerValueType({
      questionType: QuestionTypeEnum.WORD_LIST,
      value: props.value,
      formattedValue: props.value.join().replace(/,/g, ''),
    });
  }

  static createWordListFromValue(value: string): AnswerValueType {
    return new AnswerValueType({
      questionType: QuestionTypeEnum.WORD_LIST,
      value: value.split(''),
      formattedValue: value,
    });
  }

  equals(vt: AnswerValueType): boolean {
    if (this.questionType !== vt.questionType) {
      return false;
    }

    switch (this.questionType) {
      case QuestionTypeEnum.SINGLE_CHOICE:
        return this.value === vt.value;
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return this.value.length === vt.value.length && (this.value as string[]).every((v) => vt.value.includes(v));
      case QuestionTypeEnum.WORD_LIST:
        return (
          this.value.length === vt.value.length &&
          (this.value as string[]).sort().join().replace(/,/g, '') ===
            (vt.value as string[]).sort().join().replace(/,/g, '')
        );
      default:
        throw new Error('Invalid question type');
    }
  }
}
