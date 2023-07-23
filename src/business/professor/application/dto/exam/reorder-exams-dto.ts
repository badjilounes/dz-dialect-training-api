import { ApiProperty } from '@nestjs/swagger';

class ReorderExamDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;
}

export class ReorderExamsDto {
  @ApiProperty({ type: [ReorderExamDto] })
  exams!: ReorderExamDto[];
}
