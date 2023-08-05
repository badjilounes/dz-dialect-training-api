/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StartExamCommand } from '../domain/commands/start-exam/start-exam.command';
import { GetExerciseListQuery } from '../domain/queries/get-exercise-list/get-exercise-list.query';
import { GetPresentationExamIdQuery } from '../domain/queries/get-presentation-exam-id/get-presentation-exam-id.query';

import { GetExerciseResponseDto } from './dto/get-exercise-response-dto';
import { GetPresentationExamIdResponseDto } from './dto/get-presentation-exam-id-response-dto';

import { GetExamCopyDto } from '@business/student/application/dto/get-exam-copy-dto';
import { GetExamCopyResponseDto } from '@business/student/application/dto/get-exam-copy-response-dto';
import { GetExamResultDto } from '@business/student/application/dto/get-exam-result-dto';
import { GetExamResultResponseDto } from '@business/student/application/dto/get-result-response-dto';
import { StartExamDto } from '@business/student/application/dto/start-exam-dto';
import { ValidateResponseDto } from '@business/student/application/dto/validate-exam-response-dto';
import { ValidateResponseResponseDto } from '@business/student/application/dto/validate-response-dto';
import { StudentErrorInterceptor } from '@business/student/application/student.error-interceptor';
import { SkipPresentationCommand } from '@business/student/domain/commands/skip-presentation/skip-presentation.command';
import { StartPresentationCommand } from '@business/student/domain/commands/start-presentation/start-presentation.command';
import { ValidateResponseCommand } from '@business/student/domain/commands/validate-response/validate-response.command';
import { GetExamCopyQuery } from '@business/student/domain/queries/get-exam-copy/get-exam-copy.query';
import { GetExamResultQuery } from '@business/student/domain/queries/get-exam-result/get-exam-result.query';
import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { CommandBus } from '@cqrs/command';

@ApiTags('Student')
@Controller('student/training')
@UseInterceptors(StudentErrorInterceptor)
export class StudentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-presentation-exam-id', summary: 'Get the presentation exam identifier' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('get-presentation-exam-id')
  @ApiOkResponse({ type: GetPresentationExamIdResponseDto })
  getPresentationExamId(): Promise<GetPresentationExamIdResponseDto[]> {
    return this.queryBus.execute(new GetPresentationExamIdQuery());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-exercise-list', summary: 'Get the user exercise list' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('get-exercise-list')
  @ApiOkResponse({ type: GetExerciseResponseDto, isArray: true })
  getExamList(): Promise<GetExerciseResponseDto[]> {
    return this.queryBus.execute(new GetExerciseListQuery());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-exam-copy', summary: 'Get the user copy of given exam' })
  @Get('get-exam-copy')
  @ApiOkResponse({ type: GetExamCopyResponseDto })
  getExam(@Query() payload: GetExamCopyDto): Promise<GetExamCopyResponseDto> {
    return this.queryBus.execute(new GetExamCopyQuery(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-exam-result', summary: 'Get exam results' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('get-exam-result')
  @ApiOkResponse({ type: GetExamResultResponseDto })
  getExamResult(@Query() payload: GetExamResultDto): Promise<GetExamResultResponseDto> {
    return this.queryBus.execute(new GetExamResultQuery(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'validate-response', summary: 'Validate response' })
  @Post('validate-response')
  @ApiOkResponse({ type: ValidateResponseResponseDto })
  validateResponse(@Body() response: ValidateResponseDto): Promise<ValidateResponseResponseDto> {
    return this.commandBus.execute(
      new ValidateResponseCommand(response.examCopyId, response.questionId, response.response),
    );
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'start-exam', summary: 'Start exam' })
  @Post('start-exam')
  @ApiOkResponse({ type: GetExamCopyResponseDto })
  startExam(@Body() payload: StartExamDto): Promise<GetExamCopyResponseDto> {
    return this.commandBus.execute(new StartExamCommand(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'start-presentation', summary: 'Start exam' })
  @Post('start-presentation')
  @ApiOkResponse({ type: GetExamCopyResponseDto })
  async startPresentation(): Promise<GetExamCopyResponseDto> {
    return this.commandBus.execute(new StartPresentationCommand());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'skip-presentation', summary: 'Skip presentation' })
  @Post('skip-presentation')
  @ApiOkResponse()
  skipPresentation(): Promise<void> {
    return this.commandBus.execute(new SkipPresentationCommand());
  }
}
