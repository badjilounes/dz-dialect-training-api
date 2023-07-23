import { ApiProperty } from '@nestjs/swagger';

export class EditTrainingDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isPresentation!: boolean;
}
