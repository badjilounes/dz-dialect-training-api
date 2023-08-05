import { ApiProperty } from '@nestjs/swagger';

export class GetPresentationExamIdResponseDto {
  @ApiProperty()
  examId!: string;
}
