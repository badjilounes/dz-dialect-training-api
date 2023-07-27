import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../domain/enums/question-type.enum';

class GetExamListTrainingCourseExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ isArray: true, type: String })
  propositions: string[] = [];

  @ApiProperty({ type: String, isArray: true })
  answer!: string[];
}

class GetExamListTrainingCourseExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: GetExamListTrainingCourseExamQuestionResponseDto, isArray: true })
  questions: GetExamListTrainingCourseExamQuestionResponseDto[] = [];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class GetExerciseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  trainingId!: boolean;

  @ApiProperty({ type: GetExamListTrainingCourseExamResponseDto, isArray: true })
  exams!: GetExamListTrainingCourseExamResponseDto[];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
