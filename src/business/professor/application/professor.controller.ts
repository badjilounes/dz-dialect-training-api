import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateExamCommand } from '../domain/commands/exam/create-exam/create-exam.command';
import { DeleteExamCommand } from '../domain/commands/exam/delete-exam/delete-exam.command';
import { EditExamCommand } from '../domain/commands/exam/edit-exam/edit-exam.command';
import { ReorderExamsCommand } from '../domain/commands/exam/reorder-exams/reorder-exams.command';
import { CreateTrainingCommand } from '../domain/commands/training/create-training/create-training.command';
import { DeleteTrainingCommand } from '../domain/commands/training/delete-training/delete-training.command';
import { EditTrainingCommand } from '../domain/commands/training/edit-training/edit-training.command';
import { ReorderTrainingsCommand } from '../domain/commands/training/reorder-trainings/reorder-trainings.command';
import { SearchExamQuery } from '../domain/queries/search-exam/search-exam.query';
import { SearchTrainingQuery } from '../domain/queries/search-training/search-training.query';

import { CourseResponseDto } from './dto/course/course-response-dto';
import { DeleteCourseDto } from './dto/course/delete-course-dto';
import { EditCourseDto } from './dto/course/edit-course-dto';
import { CreateExamDto } from './dto/exam/create-exam-dto';
import { CreateExamResponseDto } from './dto/exam/create-exam-response-dto';
import { DeleteExamDto } from './dto/exam/delete-exam-dto';
import { EditExamDto } from './dto/exam/edit-exam-dto';
import { ExamResponseDto } from './dto/exam/exam-response-dto';
import { PaginatedExamsResponseDto } from './dto/exam/paginated-exam-response-dto';
import { ReorderExamsDto } from './dto/exam/reorder-exams-dto';
import { CreateTrainingDto } from './dto/training/create-training-dto';
import { CreateTrainingResponseDto } from './dto/training/create-training-response-dto';
import { EditTrainingDto } from './dto/training/edit-training-dto';
import { PaginatedTrainingResponseDto } from './dto/training/paginated-training-response-dto';
import { ReorderTrainingsDto } from './dto/training/reorder-trainings-dto';
import { TrainingResponseDto } from './dto/training/training-response-dto';

import { CreateCourseDto } from '@business/professor/application/dto/course/create-course-dto';
import { CreateCourseResponseDto } from '@business/professor/application/dto/course/create-course-response-dto';
import { PaginatedCoursesResponseDto } from '@business/professor/application/dto/course/paginated-course-response-dto';
import { ReorderCoursesDto } from '@business/professor/application/dto/course/reorder-courses-dto';
import { ProfessorErrorInterceptor } from '@business/professor/application/professor.error-interceptor';
import { CreateCourseCommand } from '@business/professor/domain/commands/course/create-course/create-course.command';
import { DeleteCourseCommand } from '@business/professor/domain/commands/course/delete-course/delete-course.command';
import { EditCourseCommand } from '@business/professor/domain/commands/course/edit-course/edit-course.command';
import { ReorderCoursesCommand } from '@business/professor/domain/commands/course/reorder-courses/reorder-courses.command';
import { SearchCourseQuery } from '@business/professor/domain/queries/search-course/search-course.query';
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

  @ApiOperation({ operationId: 'edit-training', summary: 'Edit training' })
  @Post('edit-training/:id')
  @ApiOkResponse({ type: EditTrainingDto })
  editTraining(@Param('id') id: string, @Body() payload: EditTrainingDto): Promise<TrainingResponseDto> {
    return this.commandBus.execute(new EditTrainingCommand(id, payload));
  }

  @ApiOperation({ operationId: 'reorder-trainings', summary: 'Reorder trainings' })
  @Post('reorder-trainings')
  @ApiOkResponse()
  reorderTrainigns(@Body() payload: ReorderTrainingsDto): Promise<void> {
    return this.commandBus.execute(new ReorderTrainingsCommand(payload.trainings));
  }

  @ApiOperation({ operationId: 'delete-training', summary: 'Delete training' })
  @Delete('delete-training/:id')
  @ApiOkResponse()
  deleteTraining(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTrainingCommand(id));
  }

  @Get('search-training')
  @ApiOperation({
    operationId: 'searchTraining',
    summary: 'Search a training',
  })
  @ApiQuery({ name: 'pageIndex', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: PaginatedTrainingResponseDto })
  searchTraining(
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('q') query = '',
  ): Promise<PaginatedTrainingResponseDto> {
    return this.queryBus.execute(new SearchTrainingQuery(pageIndex, pageSize, query));
  }

  @ApiOperation({ operationId: 'create-training-course', summary: 'Create training course' })
  @Post('create-course')
  @ApiOkResponse({ type: CreateCourseResponseDto })
  createCourse(@Body() payload: CreateCourseDto): Promise<CreateCourseResponseDto> {
    return this.commandBus.execute(new CreateCourseCommand(payload));
  }

  @ApiOperation({ operationId: 'edit-course', summary: 'Edit course' })
  @Post('edit-course/:id')
  @ApiOkResponse({ type: CourseResponseDto })
  editCourse(@Param('id') id: string, @Body() payload: EditCourseDto): Promise<CourseResponseDto> {
    return this.commandBus.execute(new EditCourseCommand(id, payload));
  }

  @ApiOperation({ operationId: 'reorder-courses', summary: 'Reorder courses' })
  @Post('reorder-courses')
  @ApiOkResponse()
  reorderCourses(@Body() payload: ReorderCoursesDto): Promise<void> {
    return this.commandBus.execute(new ReorderCoursesCommand(payload.trainingId, payload.courses));
  }

  @ApiOperation({ operationId: 'delete-course', summary: 'Delete course' })
  @Delete('delete-course')
  @ApiOkResponse()
  deleteCourse(@Body() payload: DeleteCourseDto): Promise<void> {
    return this.commandBus.execute(new DeleteCourseCommand(payload.trainingId, payload.courseId));
  }

  @Get('search-course')
  @ApiOperation({
    operationId: 'search-course',
    summary: 'Search a course',
  })
  @ApiQuery({ name: 'trainingId', required: true, type: String })
  @ApiQuery({ name: 'pageIndex', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: PaginatedCoursesResponseDto })
  searchCourse(
    @Query('trainingId') trainingId: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('q') query = '',
  ): Promise<PaginatedCoursesResponseDto> {
    return this.queryBus.execute(new SearchCourseQuery(trainingId, pageIndex, pageSize, query));
  }

  @ApiOperation({ operationId: 'create-course-exam', summary: 'Create course exam' })
  @Post('create-exam')
  @ApiOkResponse({ type: CreateExamResponseDto })
  createExam(@Body() payload: CreateExamDto): Promise<CreateExamResponseDto> {
    return this.commandBus.execute(new CreateExamCommand(payload));
  }

  @ApiOperation({ operationId: 'edit-exam', summary: 'Edit exam' })
  @Post('edit-exam')
  @ApiOkResponse({ type: ExamResponseDto })
  editExam(@Body() payload: EditExamDto): Promise<ExamResponseDto> {
    return this.commandBus.execute(new EditExamCommand(payload));
  }

  @ApiOperation({ operationId: 'reorder-exams', summary: 'Reorder exams' })
  @Post('reorder-exams')
  @ApiOkResponse()
  reorderExams(@Body() payload: ReorderExamsDto): Promise<void> {
    return this.commandBus.execute(new ReorderExamsCommand(payload.trainingId, payload.courseId, payload.exams));
  }

  @ApiOperation({ operationId: 'delete-exam', summary: 'Delete exam' })
  @Delete('delete-exam')
  @ApiOkResponse()
  deleteExam(@Body() payload: DeleteExamDto): Promise<void> {
    return this.commandBus.execute(new DeleteExamCommand(payload.trainingId, payload.courseId, payload.examId));
  }

  @Get('search-exam')
  @ApiOperation({
    operationId: 'search-exam',
    summary: 'Search an exam',
  })
  @ApiQuery({ name: 'courseId', required: true, type: String })
  @ApiQuery({ name: 'pageIndex', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: PaginatedExamsResponseDto })
  searchExam(
    @Query('courseId') courseId: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('q') query = '',
  ): Promise<PaginatedExamsResponseDto> {
    return this.queryBus.execute(new SearchExamQuery(courseId, pageIndex, pageSize, query));
  }
}
