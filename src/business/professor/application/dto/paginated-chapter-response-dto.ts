import { ApiProperty } from '@nestjs/swagger';

import { ChapterResponseDto } from '@business/professor/application/dto/chapter-response-dto';

export class PaginatedChapterResponseDto {
  @ApiProperty({ type: ChapterResponseDto, isArray: true })
  elements!: ChapterResponseDto[];

  @ApiProperty()
  length!: number;

  @ApiProperty()
  pageIndex!: number;

  @ApiProperty()
  pageSize!: number;
}
