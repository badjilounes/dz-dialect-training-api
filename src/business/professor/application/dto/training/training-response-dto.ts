import { ApiProperty } from '@nestjs/swagger';

import { CourseResponseDto } from '../course/course-response-dto';

export class TrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isPresentation!: boolean;

  @ApiProperty({ type: CourseResponseDto, isArray: true })
  courses!: CourseResponseDto[];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
