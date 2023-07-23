import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isPresentation!: boolean;
}
