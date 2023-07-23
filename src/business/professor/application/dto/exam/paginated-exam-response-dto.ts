import { ApiProperty } from '@nestjs/swagger';

import { ExamResponseDto } from './exam-response-dto';

export class PaginatedExamsResponseDto {
  @ApiProperty({ type: ExamResponseDto, isArray: true })
  elements!: ExamResponseDto[];

  @ApiProperty()
  length!: number;

  @ApiProperty()
  pageIndex!: number;

  @ApiProperty()
  pageSize!: number;
}
