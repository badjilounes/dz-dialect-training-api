import { ApiProperty } from '@nestjs/swagger';

export class GetTrainingResultResponseDto {
  @ApiProperty()
  note!: number;

  @ApiProperty()
  total!: number;
}
