import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateTrainingCommand } from '../domain/commands/create-training/create-training.command';

import { CreateChapterDto } from '@business/professor/application/dto/create-chapter-dto';
import { CreateChapterResponseDto } from '@business/professor/application/dto/create-chapter-response-dto';
import { CreateTrainingDto } from '@business/professor/application/dto/create-training-dto';
import { CreateTrainingResponseDto } from '@business/professor/application/dto/create-training-response-dto';
import { PaginatedChapterResponseDto } from '@business/professor/application/dto/paginated-chapter-response-dto';
import { ReorderChaptersDto } from '@business/professor/application/dto/reorder-chapters-dto';
import { ProfessorErrorInterceptor } from '@business/professor/application/professor.error-interceptor';
import { CreateChapterCommand } from '@business/professor/domain/commands/create-chapter/create-chapter.command';
import { DeleteChapterCommand } from '@business/professor/domain/commands/delete-chapter/delete-chapter.command';
import { EditChapterCommand } from '@business/professor/domain/commands/edit-chapter/edit-chapter.command';
import { ReorderChaptersCommand } from '@business/professor/domain/commands/reorder-chapters/reorder-chapters.command';
import { SearchChapterQuery } from '@business/professor/domain/queries/search-chapter/search-chapter.query';
import { CommandBus } from '@cqrs/command';

@ApiTags('Professor')
@Controller('professor/training')
@UseInterceptors(ProfessorErrorInterceptor)
export class ProfessorController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

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

  @ApiOperation({ operationId: 'edit-chapter/:id', summary: 'Edit chapter' })
  @Post('edit-chapter/:id')
  @ApiOkResponse({ type: CreateChapterResponseDto })
  editChapter(@Param('id') id: string, @Body() payload: CreateChapterDto): Promise<CreateChapterResponseDto> {
    return this.commandBus.execute(new EditChapterCommand(id, payload));
  }

  @ApiOperation({ operationId: 'reorder-chapters', summary: 'Reorder chapters' })
  @Post('reorder-chapters')
  @ApiOkResponse()
  reorderChapters(@Body() payload: ReorderChaptersDto): Promise<void> {
    return this.commandBus.execute(new ReorderChaptersCommand(payload.chapters));
  }

  @ApiOperation({ operationId: 'delete-chapter/:id', summary: 'Delete chapter' })
  @Delete('delete-chapter/:id')
  @ApiOkResponse()
  deleteChapter(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteChapterCommand(id));
  }

  @Get('search-chapter')
  @ApiOperation({
    operationId: 'searchChapter',
    summary: 'Search a chapter',
  })
  @ApiQuery({ name: 'pageIndex', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: PaginatedChapterResponseDto })
  search(
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('q') query = '',
  ): Promise<PaginatedChapterResponseDto> {
    return this.queryBus.execute(new SearchChapterQuery(pageIndex, pageSize, query));
  }
}
