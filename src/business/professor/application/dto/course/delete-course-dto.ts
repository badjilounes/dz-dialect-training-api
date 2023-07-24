import { ApiProperty } from '@nestjs/swagger';

export class DeleteCourseDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty()
  courseId!: string;
}
