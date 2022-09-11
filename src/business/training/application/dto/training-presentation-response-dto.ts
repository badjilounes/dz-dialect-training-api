import { ApiProperty } from '@nestjs/swagger';

import { TrainingExamTypeEnum } from '../../domain/enums/training-exam-type.enum';

class TrainingExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  question!: string;

  @ApiProperty()
  answer!: string;
}

class TrainingExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: TrainingExamTypeEnum, enumName: 'ExamTypeEnum' })
  type!: TrainingExamTypeEnum;

  @ApiProperty({ type: TrainingExamQuestionResponseDto, isArray: true })
  questions!: TrainingExamQuestionResponseDto[];
}

export class TrainingPresentationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: TrainingExamResponseDto })
  exam!: TrainingExamResponseDto;
}
