import { ApiProperty } from '@nestjs/swagger';

import { GetExamResponseDto } from '@business/student/application/dto/get-exam-response-dto';

export class GetTrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: GetExamResponseDto })
  exam!: GetExamResponseDto;
}
