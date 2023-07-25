import { ApiProperty } from '@nestjs/swagger';

export class GetExamDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;
}
