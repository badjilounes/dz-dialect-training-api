import { ApiProperty } from '@nestjs/swagger';

export class SkipExamDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;
}
