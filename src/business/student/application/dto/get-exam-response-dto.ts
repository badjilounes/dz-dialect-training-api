import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';

class GetExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ type: String, isArray: true })
  propositions!: string[];
}

export class GetExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: GetExamQuestionResponseDto, isArray: true })
  questions!: GetExamQuestionResponseDto[];
}
