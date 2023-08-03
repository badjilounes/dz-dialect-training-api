import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  color!: string;

  @ApiProperty()
  trainingId!: boolean;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
