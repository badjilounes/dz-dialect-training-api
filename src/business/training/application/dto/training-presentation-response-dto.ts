import { ApiProperty } from '@nestjs/swagger';

import { ExamTypeEnum } from '../../domain/enums/exam-type.enum';

import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';

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

  @ApiProperty({ enum: ExamTypeEnum, enumName: 'ExamTypeEnum' })
  type!: ExamTypeEnum;

  @ApiProperty({ type: TrainingExamQuestionResponseDto, isArray: true })
  questions!: TrainingExamQuestionResponseDto[];
}

export class TrainingPresentationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TrainingCategoryEnum, enumName: 'TrainingCategoryEnum' })
  category!: TrainingCategoryEnum;

  @ApiProperty({ type: TrainingExamResponseDto })
  exam!: TrainingExamResponseDto;
}
