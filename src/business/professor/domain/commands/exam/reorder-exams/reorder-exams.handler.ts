import { Inject } from '@nestjs/common';

import { ExamAggregate } from '../../../aggregates/exam.aggregate';
import { ExamCommandRepository } from '../../../repositories/exam-command-repository';
import { EXAM_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { ReorderCoursesCommandResult, ReorderExamsCommand } from './reorder-exams.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderExamsCommand)
export class ReorderExamsHandler implements ICommandHandler<ReorderExamsCommand> {
  constructor(
    @Inject(EXAM_COMMAND_REPOSITORY)
    private readonly courseExamCommandRepository: ExamCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: ReorderExamsCommand): Promise<ReorderCoursesCommandResult> {
    const examList = await this.courseExamCommandRepository.findByIdList(payload.map((exam) => exam.id));

    await Promise.all(
      examList.map((exam) => {
        const examAggregate = ExamAggregate.from({
          id: exam.id,
          name: exam.name,
          courseId: exam.courseId,
          questions: exam.questions,
        });
        this.eventPublisher.mergeObjectContext(examAggregate);

        const newOrder = payload.find((c) => c.id === examAggregate.id)?.order;

        if (newOrder !== undefined) {
          examAggregate.reorder(newOrder);
        }

        return this.courseExamCommandRepository.persist(examAggregate);
      }),
    );
  }
}
