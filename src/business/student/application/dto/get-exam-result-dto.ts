import { ApiProperty } from '@nestjs/swagger';

export class GetExamResultDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;
}
