import { ApiProperty } from '@nestjs/swagger';

import { ExamCopyStateEnum } from '../../domain/enums/exam-copy-state.enum';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';

class GetExamQuestionResponseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  valid!: boolean;

  @ApiProperty()
  answer!: string;

  @ApiProperty()
  response!: string;

  @ApiProperty()
  createdAt!: Date;
}

class GetExamQuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ type: GetExamQuestionResponseResponseDto })
  response!: GetExamQuestionResponseResponseDto;

  @ApiProperty({ type: String, isArray: true })
  propositions!: string[];

  @ApiProperty()
  order!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class GetExamCopyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  examId!: string;

  @ApiProperty({ enum: ExamCopyStateEnum, enumName: 'ExamCopyStateEnum' })
  state!: ExamCopyStateEnum;

  @ApiProperty({ type: GetExamQuestionResponseDto, isArray: true })
  questions!: GetExamQuestionResponseDto[];

  @ApiProperty()
  currentQuestionIndex!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
