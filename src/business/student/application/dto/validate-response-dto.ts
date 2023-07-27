import { ApiProperty } from '@nestjs/swagger';

import { ExamCopyStateEnum } from '../../domain/enums/exam-copy-state.enum';

export class ValidateResponseResponseDto {
  @ApiProperty()
  valid!: boolean;

  @ApiProperty()
  response!: string;

  @ApiProperty()
  answer!: string;

  @ApiProperty()
  nextQuestionIndex!: number;

  @ApiProperty({ enum: ExamCopyStateEnum, enumName: 'ExamCopyStateEnum' })
  examCopyState!: ExamCopyStateEnum;
}
