import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ExamAggregate } from '../../../domain/aggregates/exam.aggregate';
import { ExamCreatedEvent } from '../../../domain/events/exam/exam-created-event';
import { ExamDeletedEvent } from '../../../domain/events/exam/exam-deleted-event';
import { ExamReorderedEvent } from '../../../domain/events/exam/exam-reordered-event';
import { ExamUpdatedEvent } from '../../../domain/events/exam/exam-updated-event';
import { ExamCommandRepository } from '../../../domain/repositories/exam-command-repository';
import { examToExamAggregate } from '../../mappers/exam.mapper';
import { TrainingExam } from '../entities/training-exam.entity';

import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class ExamTypeormCommandRepository
  extends BaseTypeormCommandRepository<ExamAggregate>
  implements ExamCommandRepository
{
  constructor(
    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    protected readonly context: AppContextService,
  ) {
    super(examRepository, context);
    this.register(ExamCreatedEvent, this.createExam);
    this.register(ExamUpdatedEvent, this.updateExam);
    this.register(ExamDeletedEvent, this.deleteExam);
    this.register(ExamReorderedEvent, this.reorderExam);
  }

  async findByIdList(idList: string[]): Promise<ExamAggregate[]> {
    const examList = idList.length
      ? await this.examRepository.find({ where: { id: In(idList) }, relations: ['course'] })
      : [];
    return examList.map(examToExamAggregate);
  }

  public async findExamById(id: string): Promise<ExamAggregate | undefined> {
    const exam = await this.examRepository.findOne({ where: { id }, relations: ['course', 'questions.exam'] });

    if (!exam) {
      return undefined;
    }

    return examToExamAggregate(exam);
  }

  async findCourseExamByName(courseId: string, name: string, id?: string): Promise<ExamAggregate | undefined> {
    const exam = id
      ? await this.examRepository.findOne({
          where: { course: { id: courseId }, name, id: Not(id) },
          relations: ['course'],
        })
      : await this.examRepository.findOne({ where: { course: { id: courseId }, name }, relations: ['course'] });

    if (!exam) {
      return undefined;
    }

    return examToExamAggregate(exam);
  }

  private async createExam(event: ExamCreatedEvent): Promise<TrainingExam> {
    const exam = this.repository.create({
      id: event.exam.id,
      name: event.exam.name,
      course: { id: event.exam.courseId },
      questions: event.exam.questions,
    });
    return this.repository.save(exam);
  }

  private async updateExam(event: ExamUpdatedEvent): Promise<void> {
    const exam = await this.examRepository.findOne({ where: { id: event.id }, relations: ['course'] });

    this.examRepository.save({
      ...exam,
      name: event.payload.name,
      questions: event.payload.questions.map((q, i) => ({
        id: q.id,
        exam: { id: q.examId },
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: q.answer.value,
        order: i + 1,
      })),
    });
  }

  private async deleteExam(event: ExamDeletedEvent): Promise<void> {
    await this.examRepository.delete(event.id);
  }

  private async reorderExam(event: ExamReorderedEvent): Promise<void> {
    await this.examRepository.update(event.id, { order: event.order });
  }
}
