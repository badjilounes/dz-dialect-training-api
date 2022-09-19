import { ApiProperty } from '@nestjs/swagger';

export class ValidateDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  examId!: string;

  @ApiProperty()
  questionId!: string;

  @ApiProperty()
  response!: string;
}
