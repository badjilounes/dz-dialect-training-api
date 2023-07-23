import { ApiProperty } from '@nestjs/swagger';

import { QuestionTypeEnum } from '../../../domain/enums/question-type.enum';

class EditExamQuestionDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  type!: QuestionTypeEnum;

  @ApiProperty()
  question!: string;

  @ApiProperty({ type: [String] })
  propositions!: string[];

  @ApiProperty({ type: [String] })
  answer!: string[];
}

export class EditExamDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty({ type: [EditExamQuestionDto] })
  questions!: EditExamQuestionDto[];
}
