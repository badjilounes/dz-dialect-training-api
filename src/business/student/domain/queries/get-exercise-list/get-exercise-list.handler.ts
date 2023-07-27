import { Inject } from '@nestjs/common';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { GetExerciseListQuery, GetExerciseListQueryResult } from './get-exercise-list.query';

import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { EXAM_COPY_QUERY_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { IQueryHandler, QueryHandler } from '@cqrs/query';

@QueryHandler(GetExerciseListQuery)
export class GetExerciseListQueryHandler implements IQueryHandler<GetExerciseListQuery> {
  constructor(
    @Inject(EXAM_COPY_QUERY_REPOSITORY)
    private readonly examCopyQueryRepository: ExamCopyQueryRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
  ) {}

  async execute(): Promise<GetExerciseListQueryResult> {
    const allTrainingList = await this.professorGateway.getTraingList();

    const trainingList = allTrainingList.filter((training) => !training.isPresentation);

    const courseList = trainingList.flatMap((training) => training.courses);

    return Promise.all(
      courseList.map(async (course) => ({
        ...course,
        exams: await Promise.all(
          course.exams.map(async (exam) => ({
            ...exam,
            currentQuestionIndex:
              (await this.examCopyQueryRepository.findExamCopyByExamId(exam.id))?.currentQuestionIndex ?? 0,
          })),
        ),
      })),
    );
  }
}
