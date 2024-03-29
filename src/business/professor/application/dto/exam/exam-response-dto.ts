import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../../domain/enums/question-type.enum';

class CreateExamResponseQuestionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ isArray: true, type: String })
  propositions: string[] = [];

  @ApiProperty({ type: String, isArray: true })
  answer!: string[];
}

export class ExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty({ type: CreateExamResponseQuestionDto, isArray: true })
  questions: CreateExamResponseQuestionDto[] = [];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
