import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { ValidateResponseCommand, ValidateResponseCommandResult } from './validate-response.command';

import { ExamCopyQuestionNotFoundError } from '@business/student/domain/errors/exam-copy-question-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(ValidateResponseCommand)
export class ValidateResponseHandler implements ICommandHandler<ValidateResponseCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGatewway: ProfessorGateway,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ examCopyId, questionId, response }: ValidateResponseCommand): Promise<ValidateResponseCommandResult> {
    // Find given exam question
    const examCopy = await this.trainingExamCopyCommandRepository.findExamCopyById(examCopyId);
    if (!examCopy) {
      throw new ExamCopyNotFoundError(examCopyId);
    }

    const question = examCopy.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new ExamCopyQuestionNotFoundError(examCopy.id, questionId);
    }

    this.eventPublisher.mergeObjectContext(examCopy);

    examCopy.writeQuestionResponse(question, {
      id: this.uuidGenerator.generate(),
      questionId: question.id,
      response: AnswerValueType.from({
        questionType: question.type,
        value: response,
      }),
      answer: question.answer,
      createdAt: new Date(),
    });

    await this.trainingExamCopyCommandRepository.persist(examCopy);

    const savedResponse = question.response;
    if (!savedResponse) {
      throw new Error('Response should be defined');
    }

    return {
      valid: savedResponse.valid,
      response: savedResponse.response.formattedValue,
      answer: savedResponse.answer.formattedValue,
      nextQuestionIndex: examCopy.currentQuestionIndex,
      examCopyState: examCopy.state,
    };
  }
}
