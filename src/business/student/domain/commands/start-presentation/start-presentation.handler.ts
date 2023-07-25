import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { StartPresentationCommand, StartPresentationCommandResult } from './start-presentation.command';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { PresentationExamNotFoundError } from '@business/student/domain/errors/exam-presentation-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(StartPresentationCommand)
export class StartPresentationHandler implements ICommandHandler<StartPresentationCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<StartPresentationCommandResult> {
    const training = await this.professorGateway.getTrainingPresentation();
    const trainingPresentationExam = training?.courses?.[0]?.exams?.[0];
    if (!trainingPresentationExam) {
      throw new PresentationExamNotFoundError();
    }

    const copy = ExamCopyAggregate.create({
      id: this.uuidGenerator.generate(),
      examId: trainingPresentationExam.id,
      responses: [],
      state: ExamCopyStateEnum.IN_PROGRESS,
    });

    this.eventPublisher.mergeObjectContext(copy);
    await this.trainingExamCopyCommandRepository.persist(copy);

    return {
      id: trainingPresentationExam.id,
      name: trainingPresentationExam.name,
      trainingId: trainingPresentationExam.courseId,
      questions: trainingPresentationExam.questions.map((question) => ({
        id: question.id,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
      })),
    };
  }
}
