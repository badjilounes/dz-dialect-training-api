/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreatePresentationCommand } from '../domain/commands/create-presentation/create-presentation.command';

import { GetTrainingResponseDto } from './dto/get-training-response-dto';

import { CreateTrainingResponseDto } from '@business/training/application/dto/create-training-response-dto';
import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { CommandBus } from '@cqrs/command';
import { ValidateDto } from 'business/training/application/dto/validate-dto';
import { ValidateResponseDto } from 'business/training/application/dto/validate-response-dto';
import { TrainingErrorInterceptor } from 'business/training/application/training.error-interceptor';
import { ValidateResponseCommand } from 'business/training/domain/commands/validate-response/validate-response.command';
import { GetPresentationQuery } from 'business/training/domain/queries/get-presentation/get-presentation.query';

@ApiTags('Training')
@Controller('training')
@UseInterceptors(TrainingErrorInterceptor)
export class TrainingController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'create-training-presentation', summary: 'Create training presentation' })
  @Post('create-presentation')
  @ApiOkResponse({ type: CreateTrainingResponseDto })
  createTrainingPresentation(): Promise<CreateTrainingResponseDto> {
    return this.commandBus.execute(new CreatePresentationCommand());
  }

  @ApiOperation({ operationId: 'get-training-presentation', summary: 'Get training presentation' })
  @Get('get-presentation')
  @ApiOkResponse({ type: GetTrainingResponseDto })
  getTrainingPresentation(): Promise<GetTrainingResponseDto> {
    return this.queryBus.execute(new GetPresentationQuery());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'validate', summary: 'Validate exam response' })
  @Post('validate')
  @ApiOkResponse({ type: ValidateResponseDto })
  validate(@Body() response: ValidateDto): Promise<ValidateResponseDto> {
    return this.commandBus.execute(
      new ValidateResponseCommand(response.trainingId, response.examId, response.questionId, response.response),
    );
  }
}
