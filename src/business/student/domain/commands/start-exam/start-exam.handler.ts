import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { StartExamCommand, StartExamCommandResult } from './start-exam.command';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { TrainingExamNotFoundError } from '@business/student/domain/errors/training-exam-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(StartExamCommand)
export class StartExamHandler implements ICommandHandler<StartExamCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGateway: ProfessorGateway,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: StartExamCommand): Promise<StartExamCommandResult> {
    const { examId } = payload;
    const exam = await this.professorGateway.getExamById(examId);
    if (!exam) {
      throw new TrainingExamNotFoundError(examId);
    }

    const examCopyId = this.uuidGenerator.generate();
    const examCopy = ExamCopyAggregate.create({
      id: examCopyId,
      examId: exam.id,
      state: ExamCopyStateEnum.IN_PROGRESS,
      questions: exam.questions.map((question) => ({
        id: this.uuidGenerator.generate(),
        examCopyId,
        examQuestionId: question.id,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
        response: undefined,
        order: question.order,
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
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
      currentQuestionIndex: examCopy.currentQuestionIndex,
      createdAt: examCopy.createdAt,
      updatedAt: examCopy.updatedAt,
    };
  }
}
