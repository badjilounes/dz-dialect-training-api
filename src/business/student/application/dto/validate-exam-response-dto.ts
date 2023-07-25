import { ApiProperty } from '@nestjs/swagger';

export class ValidateExamResponseDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;

  @ApiProperty()
  questionId!: string;

  @ApiProperty({ type: String, isArray: true })
  response!: string[];
}
