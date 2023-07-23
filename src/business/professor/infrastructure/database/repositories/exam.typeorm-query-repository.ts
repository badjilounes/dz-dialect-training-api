import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { SearchExamQueryResult } from '../../../domain/queries/search-exam/search-exam.query';
import { ExamQueryRepository } from '../../../domain/repositories/exam-query-repository';
import { TrainingExam } from '../entities/training-exam.entity';

import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class ExamTypeormQueryRepository extends BaseTypeormQueryRepository implements ExamQueryRepository {
  constructor(
    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    protected readonly context: AppContextService,
  ) {
    super(context);
  }

  async searchExam(courseId: string, pageIndex: number, pageSize: number, query = ''): Promise<SearchExamQueryResult> {
    const options: FindManyOptions<TrainingExam> = {
      where: { course: { id: courseId } },
      order: { order: 'ASC' },
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [{ name: ILike(`%${query}%`) }];
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
        })),
      })),
      length,
      pageIndex,
      pageSize,
    };
  }
}
