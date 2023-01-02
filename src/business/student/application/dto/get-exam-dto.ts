import { ApiProperty } from '@nestjs/swagger';

export class GetExamDto {
  @ApiProperty()
  examId!: string;
}
