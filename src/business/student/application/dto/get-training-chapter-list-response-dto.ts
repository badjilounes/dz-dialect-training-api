import { ApiProperty } from '@nestjs/swagger';

import { GetTrainingResponseDto } from '@business/student/application/dto/get-training-response-dto';

class GetTrainingChapterListChapterResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class GetTrainingChapterListResponseDto {
  @ApiProperty({ type: GetTrainingChapterListChapterResponseDto })
  chapter!: string;

  @ApiProperty({ type: GetTrainingResponseDto, isArray: true })
  trainingList!: string;
}
