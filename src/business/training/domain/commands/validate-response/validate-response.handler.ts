import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ValidateResponseCommand, ValidateResponseCommandResult } from './validate-response.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { ExamCopyAggregate } from 'business/training/domain/aggregates/exam-copy.aggregate';
import { QuestionNotFoundError } from 'business/training/domain/errors/question-not-found-error';
import { ExamCopyCommandRepository } from 'business/training/domain/repositories/exam-copy-command-repository';
import {
  TRAINING_COMMAND_REPOSITORY,
  TRAINING_EXAM_COPY_COMMAND_REPOSITORY,
} from 'business/training/domain/repositories/tokens';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

@CommandHandler(ValidateResponseCommand)
export class ValidateResponseHandler implements ICommandHandler<ValidateResponseCommand> {
  constructor(
    @Inject(TRAINING_EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    trainingId,
    examId,
    questionId,
    response,
  }: ValidateResponseCommand): Promise<ValidateResponseCommandResult> {
    const question = await this.trainingCommandRepository.findExamQuestion(trainingId, examId, questionId);
    if (!question) {
      throw new QuestionNotFoundError(questionId);
    }

    let copy = await this.trainingExamCopyCommandRepository.findExamCopy(examId);
    if (!copy) {
      copy = ExamCopyAggregate.create({
        id: this.uuidGenerator.generate(),
        examId,
        responses: [],
      });
    }

    this.eventPublisher.mergeObjectContext(copy);

    const responseEntity = copy.writeResponse({
      id: this.uuidGenerator.generate(),
      question,
      response,
    });

    await this.trainingExamCopyCommandRepository.persist(copy);

    return {
      valid: responseEntity.valid,
      response: responseEntity.response,
      answer: responseEntity.answer,
    };
  }
}
