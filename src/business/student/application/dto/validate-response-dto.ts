import { ApiProperty } from '@nestjs/swagger';

export class ValidateExamResponseResponseDto {
  @ApiProperty()
  valid!: boolean;

  @ApiProperty()
  response!: string;

  @ApiProperty()
  answer!: string;
}
