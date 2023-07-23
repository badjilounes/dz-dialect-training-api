import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ExamNotFoundError } from '../../errors/exam-not-found-error';

import { SkipExamCommand, SkipExamCommandResult } from './skip-exam.command';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import {
  EXAM_COPY_COMMAND_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
} from '@business/student/domain/repositories/tokens';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { CommandHandler, ICommandHandler } from '@cqrs/command';

@CommandHandler(SkipExamCommand)
export class SkipExamHandler implements ICommandHandler<SkipExamCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id }: SkipExamCommand): Promise<SkipExamCommandResult> {
    const exam = await this.trainingCommandRepository.findExamById(id);
    if (!exam) {
      throw new ExamNotFoundError(id);
    }

    const copy = await this.trainingExamCopyCommandRepository.findExamCopyByExamId(id);
    if (copy?.state !== ExamCopyStateEnum.IN_PROGRESS) {
      throw new ExamCopyNotStartedError();
    }

    this.eventPublisher.mergeObjectContext(copy);

    copy.skip();

    await this.trainingExamCopyCommandRepository.persist(copy);
  }
}
