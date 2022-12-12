import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ValidateResponseCommand, ValidateResponseCommandResult } from './validate-response.command';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionNotFoundError } from '@business/student/domain/errors/question-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import {
  EXAM_COPY_COMMAND_REPOSITORY,
  TRAINING_COMMAND_REPOSITORY,
} from '@business/student/domain/repositories/tokens';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(ValidateResponseCommand)
export class ValidateResponseHandler implements ICommandHandler<ValidateResponseCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
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
    // Find given exam question
    const examQuestions = await this.trainingCommandRepository.findExamQuestions(trainingId, examId);
    const question = examQuestions.find((q) => q.id === questionId);
    if (!question) {
      throw new QuestionNotFoundError(questionId);
    }

    // Find existing copy of exam otherwise create a new one
    let copy = await this.trainingExamCopyCommandRepository.findExamCopy(examId);
    if (!copy) {
      copy = ExamCopyAggregate.create({
        id: this.uuidGenerator.generate(),
        examId,
        responses: [],
        state: ExamCopyStateEnum.IN_PROGRESS,
      });
    }
    this.eventPublisher.mergeObjectContext(copy);

    // Write the response for given question
    const responseEntity = copy.writeResponse({
      id: this.uuidGenerator.generate(),
      question,
      response: AnswerValueType.from({
        questionType: question.type,
        value: response,
      }),
    });

    // If this is the last question, mark the copy as completed
    if (copy.responses.length === examQuestions.length) {
      copy.complete();
    }

    await this.trainingExamCopyCommandRepository.persist(copy);

    return {
      valid: responseEntity.valid,
      response: responseEntity.response.formattedValue,
      answer: responseEntity.answer.formattedValue,
    };
  }
}
