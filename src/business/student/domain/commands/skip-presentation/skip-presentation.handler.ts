import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { TrainingPresentationNotFoundError } from '../../errors/training-presentation-not-found-error';

import { SkipPresentationCommand, SkipPresentationCommandResult } from './skip-presentation.command';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import {
  EXAM_COPY_COMMAND_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
} from '@business/student/domain/repositories/tokens';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(SkipPresentationCommand)
export class SkipPresentationHandler implements ICommandHandler<SkipPresentationCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<SkipPresentationCommandResult> {
    const presentation = await this.trainingCommandRepository.findPresentation();
    if (!presentation) {
      throw new TrainingPresentationNotFoundError();
    }

    const copy = await this.trainingExamCopyCommandRepository.findExamCopy(presentation.exams[0].id);
    if (copy?.state !== ExamCopyStateEnum.IN_PROGRESS) {
      throw new ExamCopyNotStartedError();
    }

    this.eventPublisher.mergeObjectContext(copy);

    copy.skip();

    await this.trainingExamCopyCommandRepository.persist(copy);
  }
}
