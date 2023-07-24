import { ApiProperty } from '@nestjs/swagger';

class ReorderExamDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;
}

export class ReorderExamsDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty({ type: [ReorderExamDto] })
  exams!: ReorderExamDto[];
}
