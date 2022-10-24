import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyCreatedEvent } from '@business/student/domain/events/exam-copy-created-event';
import { ExamCopyResponseAddedEvent } from '@business/student/domain/events/exam-copy-response-added-event';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { ExamCopyResponse } from '@business/student/infrastructure/database/entities/exam-copy-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { examCopyToExamCopyAggregate } from '@business/student/infrastructure/mappers/exam-copy.mapper';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class ExamCopyTypeormCommandRepository
  extends BaseTypeormCommandRepository<ExamCopyAggregate>
  implements ExamCopyCommandRepository
{
  constructor(
    @InjectRepository(ExamCopy)
    protected readonly repository: Repository<ExamCopy>,

    @InjectRepository(ExamCopyResponse)
    protected readonly responseRepository: Repository<ExamCopyResponse>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
    this.register(ExamCopyCreatedEvent, this.createExamCopy);
    this.register(ExamCopyResponseAddedEvent, this.addExamCopyResponse);
  }

  async findExamCopy(examId: string): Promise<ExamCopyAggregate | undefined> {
    const examCopy = await this.repository.findOne({
      where: { exam: { id: examId }, userId: this.context.userId },
      relations: ['exam', 'responses', 'responses.question'],
    });

    if (!examCopy) {
      return undefined;
    }

    return examCopyToExamCopyAggregate(examCopy);
  }

  private async createExamCopy(event: ExamCopyCreatedEvent): Promise<ExamCopy> {
    const examCopy = this.repository.create({
      id: event.examCopy.id,
      exam: { id: event.examCopy.examId },
      userId: this.context.userId,
      state: event.examCopy.state,
    });

    return this.repository.save(examCopy);
  }

  private async addExamCopyResponse(event: ExamCopyResponseAddedEvent): Promise<ExamCopyResponse> {
    const examCopyResponse = this.responseRepository.create({
      id: event.response.id,
      examCopy: { id: event.examCopyId },
      question: { id: event.response.questionId },
      response: event.response.response.value,
      valid: event.response.valid,
    });

    return this.responseRepository.save(examCopyResponse);
  }
}
