import { ApiProperty } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty()
  examId!: string;
}
