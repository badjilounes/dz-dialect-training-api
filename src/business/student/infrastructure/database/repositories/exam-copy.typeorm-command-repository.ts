import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { examCopyAggregateToExamCopy } from '../../mappers/exam-copy-aggregate-to-exam-copy.mapper';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyCompletedEvent } from '@business/student/domain/events/exam-copy-completed-event';
import { ExamCopyCreatedEvent } from '@business/student/domain/events/exam-copy-created-event';
import { ExamCopyResponseAddedEvent } from '@business/student/domain/events/exam-copy-response-added-event';
import { ExamCopySkippedEvent } from '@business/student/domain/events/exam-copy-skipped-event';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { ExamCopyQuestionResponse } from '@business/student/infrastructure/database/entities/exam-copy-question-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { examCopyToExamCopyAggregate } from '@business/student/infrastructure/mappers/exam-copy-to-exam-copy-aggregate.mapper';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class ExamCopyTypeormCommandRepository
  extends BaseTypeormCommandRepository<ExamCopyAggregate>
  implements ExamCopyCommandRepository
{
  constructor(
    @InjectRepository(ExamCopy)
    protected readonly repository: Repository<ExamCopy>,

    @InjectRepository(ExamCopyQuestionResponse)
    protected readonly responseRepository: Repository<ExamCopyQuestionResponse>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
    this.register(ExamCopyCreatedEvent, this.createExamCopy);
    this.register(ExamCopyResponseAddedEvent, this.addExamCopyResponse);
    this.register(ExamCopyCompletedEvent, this.completeExamCopy);
    this.register(ExamCopySkippedEvent, this.skipExamCopy);
  }

  async findExamCopyById(examCopyId: string): Promise<ExamCopyAggregate | undefined> {
    const copy = await this.repository.findOneBy({ id: examCopyId, userId: this.context.userId });

    if (!copy) {
      return undefined;
    }

    return examCopyToExamCopyAggregate(copy);
  }

  async findExamCopyByExamId(examId: string): Promise<ExamCopyAggregate | undefined> {
    const examCopy = await this.repository.findOneBy({ examId, userId: this.context.userId });

    if (!examCopy) {
      return undefined;
    }

    return examCopyToExamCopyAggregate(examCopy);
  }

  private addExamCopyResponse(event: ExamCopyResponseAddedEvent): Promise<ExamCopy> {
    return this.persistExamCopy(event.examCopy);
  }

  private async createExamCopy(event: ExamCopyCreatedEvent): Promise<ExamCopy> {
    return this.persistExamCopy(event.examCopy);
  }

  private async completeExamCopy(event: ExamCopyCompletedEvent): Promise<UpdateResult> {
    const examCopy = await this.repository.findOneOrFail({
      where: {
        id: event.examCopyId,
        userId: this.context.userId,
      },
    });

    return this.repository.update(examCopy.id, { state: ExamCopyStateEnum.COMPLETED });
  }

  private async skipExamCopy(event: ExamCopySkippedEvent): Promise<UpdateResult> {
    const examCopy = await this.repository.findOneOrFail({
      where: {
        id: event.examCopyId,
        userId: this.context.userId,
      },
    });

    return this.repository.update(examCopy.id, { state: ExamCopyStateEnum.SKIPPED });
  }

  private persistExamCopy(examCopyAggregate: ExamCopyAggregate): Promise<ExamCopy> {
    const examCopy = examCopyAggregateToExamCopy(examCopyAggregate);
    return this.repository.save({ ...examCopy, userId: this.context.userId });
  }
}
