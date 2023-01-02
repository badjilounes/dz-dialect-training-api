import { ApiProperty } from '@nestjs/swagger';

export class SkipExamDto {
  @ApiProperty()
  examId!: string;
}
