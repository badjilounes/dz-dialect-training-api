import { ApiProperty } from '@nestjs/swagger';

import { CourseResponseDto } from '@business/professor/application/dto/course/course-response-dto';

export class PaginatedCoursesResponseDto {
  @ApiProperty({ type: CourseResponseDto, isArray: true })
  elements!: CourseResponseDto[];

  @ApiProperty()
  length!: number;

  @ApiProperty()
  pageIndex!: number;

  @ApiProperty()
  pageSize!: number;
}
