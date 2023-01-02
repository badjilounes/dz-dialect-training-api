import { ApiProperty } from '@nestjs/swagger';

export class GetExamResultResponseDto {
  @ApiProperty()
  note!: number;

  @ApiProperty()
  total!: number;
}
