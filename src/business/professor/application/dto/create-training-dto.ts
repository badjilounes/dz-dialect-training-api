import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';

class CreateTrainingExamQuestionDto {
  @ApiProperty({ enum: QuestionTypeEnum, enumName: 'QuestionTypeEnum' })
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty()
  answer!: string;

  @ApiProperty({ type: String, isArray: true })
  propositions!: string[];
}

class CreateTrainingExamDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ type: CreateTrainingExamQuestionDto, isArray: true })
  questions!: CreateTrainingExamQuestionDto[];
}

export class CreateTrainingDto {
  @ApiProperty()
  chapterId?: string;

  @ApiProperty({ type: CreateTrainingExamDto, isArray: true })
  exams!: CreateTrainingExamDto[];
}
