import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreatePresentationCommand } from '../domain/commands/create-presentation/create-presentation.command';

import { CreateChapterResponseDto } from '@business/professor/application/dto/create-chapter-response-dto';
import { CreateTrainingResponseDto } from '@business/professor/application/dto/create-training-response-dto';
import { ProfessorErrorInterceptor } from '@business/professor/application/professor.error-interceptor';
import {
  CreateChapterCommand,
  CreateChapterCommandPayload,
} from '@business/professor/domain/commands/create-chapter/create-chapter.command';
import { CommandBus } from '@cqrs/command';

@ApiTags('Professor')
@Controller('professor/training')
@UseInterceptors(ProfessorErrorInterceptor)
export class ProfessorController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ operationId: 'create-training-presentation', summary: 'Create training presentation' })
  @Post('create-presentation')
  @ApiOkResponse({ type: CreateTrainingResponseDto })
  createTrainingPresentation(): Promise<CreateTrainingResponseDto> {
    return this.commandBus.execute(new CreatePresentationCommand());
  }

  @ApiOperation({ operationId: 'create-training-chapter', summary: 'Create training chapter' })
  @Post('create-chapter')
  @ApiOkResponse({ type: CreateChapterResponseDto })
  createChapter(@Body() payload: CreateChapterCommandPayload): Promise<CreateChapterResponseDto> {
    return this.commandBus.execute(new CreateChapterCommand(payload));
  }
}
