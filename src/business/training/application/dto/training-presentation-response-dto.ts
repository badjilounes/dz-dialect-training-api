import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';

class TrainingExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

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
