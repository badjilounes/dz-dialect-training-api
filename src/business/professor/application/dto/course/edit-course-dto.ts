import { ApiProperty } from '@nestjs/swagger';

export class EditCourseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  trainingId!: string;
}
