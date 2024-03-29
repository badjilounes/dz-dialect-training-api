import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../../domain/enums/question-type.enum';

class CreateExamQuestionDto {
  @ApiProperty({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ isArray: true, type: String })
  propositions: string[] = [];

  @ApiProperty({ isArray: true, type: String })
  answer!: string[];
}

export class CreateExamDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty({ type: CreateExamQuestionDto, isArray: true })
  questions: CreateExamQuestionDto[] = [];
}
