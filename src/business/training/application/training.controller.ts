/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StartPresentationCommand } from '../domain/commands/start-presentation/start-presentation.command';

import { TrainingPresentationResponseDto } from './dto/training-presentation-response-dto';

import { CommandBus } from '@cqrs/command';

@ApiTags('Training')
@Controller('training')
export class TrainingController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ operationId: 'get-training-presentation', summary: 'Get training presentation' })
  @Post('start-presentation')
  @ApiOkResponse({ type: TrainingPresentationResponseDto })
  getConnectedUser(): Promise<TrainingPresentationResponseDto> {
    return this.commandBus.execute(new StartPresentationCommand());
  }
}
