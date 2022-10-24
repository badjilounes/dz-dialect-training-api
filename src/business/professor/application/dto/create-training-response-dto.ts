import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/professor/domain/enums/training-category.enum';

class CreateTrainingExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ type: String, isArray: true })
  propositions!: string[];
}

class CreateTrainingExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: CreateTrainingExamQuestionResponseDto, isArray: true })
  questions!: CreateTrainingExamQuestionResponseDto[];
}

export class CreateTrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TrainingCategoryEnum, enumName: 'TrainingCategoryEnum' })
  category!: TrainingCategoryEnum;

  @ApiProperty({ type: CreateTrainingExamResponseDto })
  exam!: CreateTrainingExamResponseDto;
}
