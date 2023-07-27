import { ApiProperty } from '@nestjs/swagger';

export class ValidateResponseDto {
  @ApiProperty()
  examCopyId!: string;

  @ApiProperty()
  questionId!: string;

  @ApiProperty({ type: String, isArray: true })
  response!: string[];
}
