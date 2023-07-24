import { ApiProperty } from '@nestjs/swagger';

export class DeleteExamDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  examId!: string;
}
