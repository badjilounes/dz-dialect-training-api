import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { TrainingPresentationExamNotFoundError } from '../../errors/training-presentation-exam-not-found-error';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { SkipEPresentationCommandResult, SkipPresentationCommand } from './skip-presentation.command';

import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { CommandHandler, ICommandHandler } from '@cqrs/command';

@CommandHandler(SkipPresentationCommand)
export class SkipPrensentationHandler implements ICommandHandler<SkipPresentationCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<SkipEPresentationCommandResult> {
    const presentation = await this.professorGateway.getTrainingPresentation();
    const presentationExam = presentation?.courses?.[0]?.exams?.[0];
    if (!presentationExam) {
      throw new TrainingPresentationExamNotFoundError();
    }

    const presentationExamId = presentationExam.id;
    const presentationExamCopy = await this.trainingExamCopyCommandRepository.findExamCopyByExamId(presentationExamId);
    if (!presentationExamCopy) {
      throw new ExamCopyNotStartedError(presentationExamId);
    }

    this.eventPublisher.mergeObjectContext(presentationExamCopy);

    presentationExamCopy.skip();

    await this.trainingExamCopyCommandRepository.persist(presentationExamCopy);
  }
}
