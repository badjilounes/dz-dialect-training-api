/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { StartPresentationCommand } from '../domain/commands/start-presentation/start-presentation.command';

import { GetTrainingResponseDto } from './dto/get-training-response-dto';

import { GetTrainingResultResponseDto } from '@business/student/application/dto/get-training-result-response-dto';
import { ValidateDto } from '@business/student/application/dto/validate-dto';
import { ValidateResponseDto } from '@business/student/application/dto/validate-response-dto';
import { StudentErrorInterceptor } from '@business/student/application/student.error-interceptor';
import { SkipPresentationCommand } from '@business/student/domain/commands/skip-presentation/skip-presentation.command';
import { ValidateResponseCommand } from '@business/student/domain/commands/validate-response/validate-response.command';
import { GetExamPresentationResultQuery } from '@business/student/domain/queries/get-exam-presentation-result/get-exam-presentation-result.query';
import { GetPresentationQuery } from '@business/student/domain/queries/get-presentation/get-presentation.query';
import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { CommandBus } from '@cqrs/command';

@ApiTags('Student')
@Controller('student/training')
@UseInterceptors(StudentErrorInterceptor)
export class StudentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'get-training-presentation', summary: 'Get training presentation' })
  @Get('get-presentation')
  @ApiOkResponse({ type: GetTrainingResponseDto })
  getTrainingPresentation(): Promise<GetTrainingResponseDto> {
    return this.queryBus.execute(new GetPresentationQuery());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiOperation({ operationId: 'get-presentation-result', summary: 'Get training presentation' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('get-presentation-result')
  @ApiOkResponse({ type: GetTrainingResultResponseDto })
  getTrainingPresentationResult(): Promise<GetTrainingResultResponseDto> {
    return this.queryBus.execute(new GetExamPresentationResultQuery());
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'validate-presentation', summary: 'Validate exam response' })
  @Post('validate')
  @ApiOkResponse({ type: ValidateResponseDto })
  validate(@Body() response: ValidateDto): Promise<ValidateResponseDto> {
    return this.commandBus.execute(
      new ValidateResponseCommand(response.trainingId, response.examId, response.questionId, response.response),
    );
  }

  @UseGuards(GuestOrUserAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-guest-id', required: false })
  @ApiOperation({ operationId: 'start-presentation', summary: 'Start presentation' })
  @Post('start-presentation')
  @ApiOkResponse({ type: GetTrainingResponseDto })
  startPresentation(): Promise<GetTrainingResponseDto> {
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
