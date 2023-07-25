import { ApiProperty } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;
}
