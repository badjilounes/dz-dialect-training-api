import { ApiProperty } from '@nestjs/swagger';

export class GetExamCopyDto {
  @ApiProperty()
  examId!: string;
}
