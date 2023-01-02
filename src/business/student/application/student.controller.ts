/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StartExamCommand } from '../domain/commands/start-exam/start-exam.command';

import { GetExamDto } from '@business/student/application/dto/get-exam-dto';
import { GetExamResponseDto } from '@business/student/application/dto/get-exam-response-dto';
import { GetExamResultDto } from '@business/student/application/dto/get-exam-result-dto';
import { GetExamResultResponseDto } from '@business/student/application/dto/get-result-response-dto';
import { SkipExamDto } from '@business/student/application/dto/skip-exam-dto';
import { StartExamDto } from '@business/student/application/dto/start-exam-dto';
import { ValidateExamResponseDto } from '@business/student/application/dto/validate-exam-response-dto';
import { ValidateExamResponseResponseDto } from '@business/student/application/dto/validate-response-dto';
import { StudentErrorInterceptor } from '@business/student/application/student.error-interceptor';
import { SkipExamCommand } from '@business/student/domain/commands/skip-exam/skip-exam.command';
import { StartPresentationCommand } from '@business/student/domain/commands/start-presentation/start-presentation.command';
import { ValidateResponseCommand } from '@business/student/domain/commands/validate-response/validate-response.command';
import { GetExamResultQuery } from '@business/student/domain/queries/get-exam-result/get-exam-result.query';
import { GetExamQuery } from '@business/student/domain/queries/get-exam/get-exam.query';
import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { CommandBus } from '@cqrs/command';

@ApiTags('Student')
@Controller('student/training')
@UseInterceptors(StudentErrorInterceptor)
export class StudentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'get-exam', summary: 'Get exam' })
  @Get('get-exam')
  @ApiOkResponse({ type: GetExamResponseDto })
  getExam(@Query() payload: GetExamDto): Promise<GetExamResponseDto> {
    return this.queryBus.execute(new GetExamQuery(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiOperation({ operationId: 'get-exam-result', summary: 'Get training exam results' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('get-exam-result')
  @ApiOkResponse({ type: GetExamResultResponseDto })
  getTrainingExamResult(@Query() payload: GetExamResultDto): Promise<GetExamResultResponseDto> {
    return this.queryBus.execute(new GetExamResultQuery(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'validate-exam-response', summary: 'Validate exam response' })
  @Post('validate-exam-response')
  @ApiOkResponse({ type: ValidateExamResponseResponseDto })
  validateExamResponse(@Body() response: ValidateExamResponseDto): Promise<ValidateExamResponseResponseDto> {
    return this.commandBus.execute(
      new ValidateResponseCommand(response.trainingId, response.examId, response.questionId, response.response),
    );
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'start-exam', summary: 'Start exam' })
  @Post('start-exam')
  @ApiOkResponse({ type: GetExamResponseDto })
  startExam(@Body() payload: StartExamDto): Promise<GetExamResponseDto> {
    return this.commandBus.execute(new StartExamCommand(payload));
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'start-presentation', summary: 'Start exam' })
  @Post('start-presentation')
  @ApiOkResponse({ type: GetExamResponseDto })
  startPresentation(): Promise<GetExamResponseDto> {
    return this.commandBus.execute(new StartPresentationCommand());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'skip-exam', summary: 'Skip exam' })
  @Post('skip-exam')
  @ApiOkResponse()
  skipExam(@Body() { examId: id }: SkipExamDto): Promise<void> {
    return this.commandBus.execute(new SkipExamCommand(id));
  }
}
