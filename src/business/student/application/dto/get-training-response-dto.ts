import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';

class GetTrainingExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ type: String, isArray: true })
  propositions!: string[];
}

class GetTrainingExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: GetTrainingExamQuestionResponseDto, isArray: true })
  questions!: GetTrainingExamQuestionResponseDto[];
}

export class GetTrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TrainingCategoryEnum, enumName: 'TrainingCategoryEnum' })
  category!: TrainingCategoryEnum;

  @ApiProperty({ type: GetTrainingExamResponseDto })
  exam!: GetTrainingExamResponseDto;
}
