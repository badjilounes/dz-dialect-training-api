/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreatePresentationCommand } from '../domain/commands/create-presentation/create-presentation.command';

import { TrainingPresentationResponseDto } from './dto/training-presentation-response-dto';

import { CommandBus } from '@cqrs/command';
import { TrainingErrorInterceptor } from 'business/training/application/training.error-interceptor';
import { GetPresentationQuery } from 'business/training/domain/queries/get-presentation/get-presentation.query';

@ApiTags('Training')
@Controller('training')
@UseInterceptors(TrainingErrorInterceptor)
export class TrainingController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'create-training-presentation', summary: 'Create training presentation' })
  @Post('create-presentation')
  @ApiOkResponse({ type: TrainingPresentationResponseDto })
  createTrainingPresentation(): Promise<TrainingPresentationResponseDto> {
    return this.commandBus.execute(new CreatePresentationCommand());
  }

  @ApiOperation({ operationId: 'get-training-presentation', summary: 'Get training presentation' })
  @Get('get-presentation')
  @ApiOkResponse({ type: TrainingPresentationResponseDto })
  getTrainingPresentation(): Promise<TrainingPresentationResponseDto> {
    return this.queryBus.execute(new GetPresentationQuery());
  }
}
