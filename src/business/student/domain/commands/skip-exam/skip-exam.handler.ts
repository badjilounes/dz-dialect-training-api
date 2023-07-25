import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ExamNotFoundError } from '../../errors/exam-not-found-error';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { SkipExamCommand, SkipExamCommandResult } from './skip-exam.command';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { CommandHandler, ICommandHandler } from '@cqrs/command';

@CommandHandler(SkipExamCommand)
export class SkipExamHandler implements ICommandHandler<SkipExamCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, courseId, examId }: SkipExamCommand): Promise<SkipExamCommandResult> {
    const exam = await this.professorGateway.getExamById(trainingId, courseId, examId);
    if (!exam) {
      throw new ExamNotFoundError(examId);
    }

    const copy = await this.trainingExamCopyCommandRepository.findExamCopyByExamId(examId);
    if (copy?.state !== ExamCopyStateEnum.IN_PROGRESS) {
      throw new ExamCopyNotStartedError();
    }

    this.eventPublisher.mergeObjectContext(copy);

    copy.skip();

    await this.trainingExamCopyCommandRepository.persist(copy);
  }
}
