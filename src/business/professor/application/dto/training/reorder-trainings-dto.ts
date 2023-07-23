import { ApiProperty } from '@nestjs/swagger';

class ReorderTrainingDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;
}

export class ReorderTrainingsDto {
  @ApiProperty({ type: [ReorderTrainingDto] })
  trainings!: ReorderTrainingDto[];
}
