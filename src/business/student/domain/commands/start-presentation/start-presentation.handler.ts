import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { StartPresentationCommand, StartPresentationCommandResult } from './start-presentation.command';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { TrainingPresentationExamNotFoundError } from '@business/student/domain/errors/training-presentation-exam-not-found-error';
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
      throw new TrainingPresentationExamNotFoundError();
    }

    const examCopyId = this.uuidGenerator.generate();
    const examCopy = ExamCopyAggregate.create({
      id: examCopyId,
      examId: trainingPresentationExam.id,
      state: ExamCopyStateEnum.IN_PROGRESS,
      questions: trainingPresentationExam.questions.map((question) => ({
        id: this.uuidGenerator.generate(),
        examCopyId,
        examQuestionId: question.id,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
        response: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      currentQuestionIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.eventPublisher.mergeObjectContext(examCopy);
    await this.trainingExamCopyCommandRepository.persist(examCopy);

    return {
      id: examCopy.id,
      examId: examCopy.examId,
      state: examCopy.state,
      questions: examCopy.questions.map((question) => ({
        id: question.id,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        order: question.order,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      currentQuestionIndex: examCopy.currentQuestionIndex,
      createdAt: examCopy.createdAt,
      updatedAt: examCopy.updatedAt,
    };
  }
}
