import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../../domain/enums/question-type.enum';

class AnswerResponseDto {
  @ApiProperty({ enum: QuestionTypeEnum })
  questionType!: QuestionTypeEnum;

  @ApiProperty({ isArray: true, type: String })
  value!: string[];

  @ApiProperty()
  formattedValue!: string;
}

class CreateExamResponseQuestionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ isArray: true, type: String })
  propositions: string[] = [];

  @ApiProperty({ type: AnswerResponseDto })
  answer!: AnswerResponseDto;
}

export class CreateExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  questions: CreateExamResponseQuestionDto[] = [];
}
