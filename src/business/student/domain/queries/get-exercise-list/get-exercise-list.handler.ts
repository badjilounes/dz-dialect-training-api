import { Inject } from '@nestjs/common';

import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { Course, Exam, ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';
import { ResultValueType } from '../../value-types/result.value-type';

import {
  GetExerciseListCourseQueryResult,
  GetExerciseListExamQueryResult,
  GetExerciseListQuery,
  GetExerciseListQueryResult,
} from './get-exercise-list.query';

import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
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
    const trainingList = await this.professorGateway.getTraingList({ isPresentation: false });

    return Promise.all(
      trainingList.map(async (training) => ({
        ...training,
        courses: await this.buildCourseList(training.courses),
      })),
    );
  }

  private async buildCourseList(courseList: Course[]): Promise<GetExerciseListCourseQueryResult[]> {
    return Promise.all(
      courseList.map(async (course) => ({
        ...course,
        exams: await this.buildExamList(course.exams),
      })),
    );
  }

  private async buildExamList(examList: Exam[]): Promise<GetExerciseListExamQueryResult[]> {
    const examIdList = examList.map((exam) => exam.id);
    const examCopyList = await this.examCopyQueryRepository.findExamCopyList();
    const latestExamCopyInProgress = await this.examCopyQueryRepository.getLatestExamCopyInProgress(examIdList);
    const latestExamCopyCompleted = await this.examCopyQueryRepository.getLatestExamCopyCompleted(examIdList);

    return examList.map((exam, index) => {
      const result = this.buildExamResult(exam.id, examCopyList);
      return {
        ...exam,
        result,
        current: this.buildCurrentExam(examList, exam, index, latestExamCopyInProgress, latestExamCopyCompleted),
      };
    });
  }

  private buildCurrentExam(
    examList: Exam[],
    exam: Exam,
    index: number,
    examCopyInProgress?: ExamCopy,
    latestExamCopyCompleted?: ExamCopy,
  ): { questionIndex: number; questionLength: number } | undefined {
    const isFirstWithoutNextExam = index === 0 && !examCopyInProgress && !latestExamCopyCompleted;
    if (isFirstWithoutNextExam) {
      return {
        questionIndex: 0,
        questionLength: exam.questions.length,
      };
    }

    const isExamInProgress = examCopyInProgress && examCopyInProgress.examId === exam.id;
    if (isExamInProgress) {
      return {
        questionIndex: examCopyInProgress.currentQuestionIndex,
        questionLength: exam.questions.length,
      };
    }

    const isPreviousExamCompleted =
      latestExamCopyCompleted && latestExamCopyCompleted.examId === examList[index - 1]?.id;
    if (isPreviousExamCompleted) {
      return {
        questionIndex: 0,
        questionLength: exam.questions.length,
      };
    }

    return undefined;
  }

  private buildExamResult(examId: string, examCopyList: ExamCopy[]): { score: number; maxScore: number } | undefined {
    const examCopy = examCopyList.find((copy) => copy.examId === examId && copy.state === ExamCopyStateEnum.COMPLETED);

    if (examCopy?.state !== ExamCopyStateEnum.COMPLETED) {
      return undefined;
    }

    const result = ResultValueType.fromCopy({
      state: examCopy.state,
      questions: examCopy.questions,
    });

    return {
      score: result.score,
      maxScore: result.maxScore,
    };
  }
}
