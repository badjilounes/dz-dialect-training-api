import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { SearchCourseQueryResult } from '../../../domain/queries/search-course/search-course.query';
import { SearchExamQueryResult } from '../../../domain/queries/search-exam/search-exam.query';
import { SearchTrainingQueryResult } from '../../../domain/queries/search-training/search-training.query';
import { TrainingQueryRepository } from '../../../domain/repositories/training-query-repository';
import { TrainingCourseExam } from '../entities/training-course-exam.entity';
import { TrainingCourse } from '../entities/training-course.entity';
import { Training } from '../entities/training.entity';

import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class TrainingTypeormQueryRepository extends BaseTypeormQueryRepository implements TrainingQueryRepository {
  constructor(
    @InjectRepository(Training)
    protected readonly trainingRepository: Repository<Training>,

    @InjectRepository(TrainingCourse)
    protected readonly courseRepository: Repository<TrainingCourse>,

    @InjectRepository(TrainingCourseExam)
    protected readonly examRepository: Repository<TrainingCourseExam>,

    protected readonly context: AppContextService,
  ) {
    super(context);
  }

  async searchTraining(pageIndex: number, pageSize: number, query = ''): Promise<SearchTrainingQueryResult> {
    const options: FindManyOptions<Training> = {
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [
        { name: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
        { courses: { name: ILike(`%${query}%`) } },
        { courses: { description: ILike(`%${query}%`) } },
      ];
    }

    const [elements, length] = await this.trainingRepository.findAndCount(options);

    return {
      elements,
      length,
      pageIndex,
      pageSize,
    };
  }

  async searchCourse(
    trainingId: string,
    pageIndex: number,
    pageSize: number,
    query = '',
  ): Promise<SearchCourseQueryResult> {
    const options: FindManyOptions<TrainingCourse> = {
      where: { training: { id: trainingId } },
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [
        { training: { id: trainingId }, name: ILike(`%${query}%`) },
        { training: { id: trainingId }, description: ILike(`%${query}%`) },
      ];
    }

    const [elements, length] = await this.courseRepository.findAndCount(options);

    return {
      elements,
      length,
      pageIndex,
      pageSize,
    };
  }

  async searchExam(courseId: string, pageIndex: number, pageSize: number, query = ''): Promise<SearchExamQueryResult> {
    const options: FindManyOptions<TrainingCourseExam> = {
      where: { course: { id: courseId } },
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [{ course: { id: courseId }, name: ILike(`%${query}%`) }];
    }

    const [elements, length] = await this.examRepository.findAndCount(options);

    return {
      elements: elements.map((e) => ({
        id: e.id,
        name: e.name,
        order: e.order,
        questions: e.questions.map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          propositions: q.propositions,
          answer: q.answer,
          order: q.order,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        })),
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
      length,
      pageIndex,
      pageSize,
    };
  }
}
