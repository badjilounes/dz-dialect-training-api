import { ApiProperty } from '@nestjs/swagger';

export class ValidateResponseDto {
  @ApiProperty()
  valid!: boolean;

  @ApiProperty()
  response!: string;

  @ApiProperty({ type: String, isArray: true })
  answer!: string[];
}
