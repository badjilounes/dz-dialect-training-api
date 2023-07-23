import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';

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

class CreateTrainingCourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: CreateTrainingExamResponseDto, isArray: true })
  exams!: CreateTrainingExamResponseDto[];
}

export class CreateTrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isPresentation!: boolean;

  @ApiProperty({ type: CreateTrainingCourseResponseDto })
  courses!: CreateTrainingCourseResponseDto[];
}
