import { Inject } from '@nestjs/common';

import { ExamAggregate } from '../../../aggregates/exam.aggregate';
import { CourseExamNotFoundError } from '../../../errors/course-exam-not-found-error';
import { ExamCommandRepository } from '../../../repositories/exam-command-repository';
import { EXAM_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { DeleteExamCommand } from './delete-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteExamCommand)
export class DeleteExamHandler implements ICommandHandler<DeleteExamCommand> {
  constructor(
    @Inject(EXAM_COMMAND_REPOSITORY)
    private readonly courseExamCommandRepository: ExamCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id }: DeleteExamCommand): Promise<void> {
    const examById = await this.courseExamCommandRepository.findExamById(id);
    if (!examById) {
      throw new CourseExamNotFoundError(id);
    }

    const exam = ExamAggregate.from({
      id: examById.name,
      courseId: examById.courseId,
      name: examById.name,
      questions: examById.questions,
    });
    this.eventPublisher.mergeObjectContext(exam);

    examById.delete();

    return this.courseExamCommandRepository.persist(examById);
  }
}
