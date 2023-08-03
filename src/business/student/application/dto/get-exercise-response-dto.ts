import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../domain/enums/question-type.enum';

class GetExerciseExamQuestionResponseDto {
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

export class GetExerciseExamCurrentResponseDto {
  @ApiProperty()
  questionIndex!: number;

  @ApiProperty()
  questionLength!: number;
}

export class GetExerciseExamResultResponseDto {
  @ApiProperty()
  score!: number;

  @ApiProperty()
  maxScore!: number;
}

class GetExerciseExamResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: GetExerciseExamQuestionResponseDto, isArray: true })
  questions: GetExerciseExamQuestionResponseDto[] = [];

  @ApiProperty({ type: GetExerciseExamCurrentResponseDto, required: false })
  current?: GetExerciseExamCurrentResponseDto;

  @ApiProperty({ type: GetExerciseExamResultResponseDto, required: false })
  result?: GetExerciseExamResultResponseDto;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class GetExerciseCourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  color!: string;

  @ApiProperty()
  trainingId!: boolean;

  @ApiProperty({ type: GetExerciseExamResponseDto, isArray: true })
  exams!: GetExerciseExamResponseDto[];

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

  @ApiProperty({ type: GetExerciseCourseResponseDto, isArray: true })
  courses!: GetExerciseCourseResponseDto[];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
