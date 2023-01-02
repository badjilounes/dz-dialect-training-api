import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTrainingCommand } from '../domain/commands/create-training/create-training.command';

import { CreateChapterDto } from '@business/professor/application/dto/create-chapter-dto';
import { CreateChapterResponseDto } from '@business/professor/application/dto/create-chapter-response-dto';
import { CreateTrainingDto } from '@business/professor/application/dto/create-training-dto';
import { CreateTrainingResponseDto } from '@business/professor/application/dto/create-training-response-dto';
import { ProfessorErrorInterceptor } from '@business/professor/application/professor.error-interceptor';
import { CreateChapterCommand } from '@business/professor/domain/commands/create-chapter/create-chapter.command';
import { CommandBus } from '@cqrs/command';

@ApiTags('Professor')
@Controller('professor/training')
@UseInterceptors(ProfessorErrorInterceptor)
export class ProfessorController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ operationId: 'create-training', summary: 'Create training' })
  @Post('create-training')
  @ApiOkResponse({ type: CreateTrainingResponseDto })
  createTrainingPresentation(@Body() payload: CreateTrainingDto): Promise<CreateTrainingResponseDto> {
    return this.commandBus.execute(new CreateTrainingCommand(payload));
  }

  @ApiOperation({ operationId: 'create-training-chapter', summary: 'Create training chapter' })
  @Post('create-chapter')
  @ApiOkResponse({ type: CreateChapterResponseDto })
  createChapter(@Body() payload: CreateChapterDto): Promise<CreateChapterResponseDto> {
    return this.commandBus.execute(new CreateChapterCommand(payload));
  }
}
