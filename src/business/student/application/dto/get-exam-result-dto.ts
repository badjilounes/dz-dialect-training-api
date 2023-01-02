import { ApiProperty } from '@nestjs/swagger';

export class GetExamResultDto {
  @ApiProperty()
  examId!: string;
}
