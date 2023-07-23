import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  trainingId!: string;
}
