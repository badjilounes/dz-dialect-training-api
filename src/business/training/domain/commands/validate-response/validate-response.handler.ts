import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ValidateResponseCommand, ValidateResponseCommandResult } from './validate-response.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { ExamNotFoundError } from 'business/training/domain/errors/exam-not-found-error';
import { QuestionNotFoundError } from 'business/training/domain/errors/question-not-found-error';
import { TrainingNotFoundError } from 'business/training/domain/errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from 'business/training/domain/repositories/tokens';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

@CommandHandler(ValidateResponseCommand)
export class ValidateResponseHandler implements ICommandHandler<ValidateResponseCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY) private readonly trainingCommandRepository: TrainingCommandRepository,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, examId, questionId }: ValidateResponseCommand): Promise<ValidateResponseCommandResult> {
    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const exam = training.exams.find((e) => e.id === examId);
    if (!exam) {
      throw new ExamNotFoundError(examId);
    }

    const question = exam.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new QuestionNotFoundError(questionId);
    }

    return {
      valid: false,
      answer: '',
      successList: [],
    };
  }
}
