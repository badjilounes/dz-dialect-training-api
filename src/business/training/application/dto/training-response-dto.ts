import { ApiProperty } from '@nestjs/swagger';

import { TrainingStateEnum } from '../../domain/enums/training-state.enum';
import { TrainingTypeEnum } from '../../domain/enums/training-type.enum';

class TrainingStepResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty({ required: false })
  response?: string;

  @ApiProperty({ required: false })
  valid?: boolean;
}

export class TrainingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  language: string;

  @ApiProperty({ enum: TrainingTypeEnum, enumName: 'TrainingTypeEnum' })
  type: TrainingTypeEnum;

  @ApiProperty({ enum: TrainingStateEnum, enumName: 'TrainingStateEnum' })
  state: TrainingStateEnum;

  @ApiProperty({ type: TrainingStepResponseDto, isArray: true })
  steps: TrainingStepResponseDto[];
}
