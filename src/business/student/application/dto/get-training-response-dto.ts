import { ApiProperty } from '@nestjs/swagger';

import { GetExamResponseDto } from '@business/student/application/dto/get-exam-response-dto';
import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';

export class GetTrainingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TrainingCategoryEnum, enumName: 'TrainingCategoryEnum' })
  category!: TrainingCategoryEnum;

  @ApiProperty({ type: GetExamResponseDto })
  exam!: GetExamResponseDto;
}
