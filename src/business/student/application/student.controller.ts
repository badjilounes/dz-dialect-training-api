/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetTrainingResponseDto } from './dto/get-training-response-dto';

import { GetTrainingResultResponseDto } from '@business/student/application/dto/get-training-result-response-dto';
import { ShouldShowPresentationResponseDto } from '@business/student/application/dto/should-show-presentation-response-dto';
import { ValidateDto } from '@business/student/application/dto/validate-dto';
import { ValidateResponseDto } from '@business/student/application/dto/validate-response-dto';
import { StudentErrorInterceptor } from '@business/student/application/student.error-interceptor';
import { ValidateResponseCommand } from '@business/student/domain/commands/validate-response/validate-response.command';
import { GetExamPresentationResultQuery } from '@business/student/domain/queries/get-exam-presentation-result/get-exam-presentation-result.query';
import { GetPresentationQuery } from '@business/student/domain/queries/get-presentation/get-presentation.query';
import { ShouldShowPresentationQuery } from '@business/student/domain/queries/should-show-presentation/should-show-presentation.query';
import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { CommandBus } from '@cqrs/command';

@ApiTags('Student')
@Controller('student/training')
@UseInterceptors(StudentErrorInterceptor)
export class StudentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @ApiOperation({ operationId: 'should-show-presentation', summary: 'Whether presentation should be shown or not' })
  @ApiHeader({ name: 'x-guest-id', required: false })
  @Get('should-show-presentation')
  @ApiOkResponse({ type: ShouldShowPresentationResponseDto })
  async shouldShowPresentation(): Promise<ShouldShowPresentationResponseDto> {
    return { showPresentation: await this.queryBus.execute(new ShouldShowPresentationQuery()) };
  }

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
}
