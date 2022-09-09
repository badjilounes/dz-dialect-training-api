/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetTrainingForBeVerbLearningQuery } from '../domain/queries/get-training-for-be-verb-learning/get-training-for-be-verb-learning.query';

import { TrainingResponseDto } from './dto/training-response-dto';

import { JwtAuthGuard } from 'src/core/auth/jwt.guard';

@ApiTags('Training')
@Controller('training')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'get-training-presentation', summary: 'Get training presentation' })
  @Get('get-training-for-be-verb-learning')
  @ApiOkResponse({ type: TrainingResponseDto })
  getConnectedUser(): Promise<TrainingResponseDto> {
    return this.queryBus.execute(new GetTrainingForBeVerbLearningQuery());
  }
}
