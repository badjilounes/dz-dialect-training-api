import { ApiProperty } from '@nestjs/swagger';

class ReorderCourseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;
}

export class ReorderCoursesDto {
  @ApiProperty()
  trainingId!: string;

  @ApiProperty({ type: [ReorderCourseDto] })
  courses!: ReorderCourseDto[];
}
