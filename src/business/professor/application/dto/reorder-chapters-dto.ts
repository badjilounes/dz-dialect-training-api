import { ApiProperty } from '@nestjs/swagger';

class ReorderChapterDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;
}

export class ReorderChaptersDto {
  @ApiProperty({ type: [ReorderChapterDto] })
  chapters!: ReorderChapterDto[];
}
