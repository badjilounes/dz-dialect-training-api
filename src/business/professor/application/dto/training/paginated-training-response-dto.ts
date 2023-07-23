import { ApiProperty } from '@nestjs/swagger';

import { TrainingResponseDto } from './training-response-dto';

export class PaginatedTrainingResponseDto {
  @ApiProperty({ type: TrainingResponseDto, isArray: true })
  elements!: TrainingResponseDto[];

  @ApiProperty()
  length!: number;

  @ApiProperty()
  pageIndex!: number;

  @ApiProperty()
  pageSize!: number;
}
