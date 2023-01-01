import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}
