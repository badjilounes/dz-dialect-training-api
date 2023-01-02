import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../aggregates/training.aggregate';
import { TRAINING_COMMAND_REPOSITORY } from '../../repositories/tokens';

import {
  CreateTrainingCommand,
  CreateTrainingCommandPayload,
  CreateTrainingCommandResult,
} from './create-training.command';

import { ExamEntityProps } from '@business/professor/domain/entities/exam.entity';
import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateTrainingCommand)
export class CreateTrainingHandler implements ICommandHandler<CreateTrainingCommand> {
  questionsType: QuestionTypeEnum = QuestionTypeEnum.WORD_LIST;

  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateTrainingCommand): Promise<CreateTrainingCommandResult> {
    const trainingId = this.uuidGenerator.generate();

    const training = TrainingAggregate.create({
      id: trainingId,
      chapterId: payload.chapterId,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: this.buildExamsFromPayload(payload, trainingId),
    });

    this.eventPublisher.mergeObjectContext(training);

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      chapterId: training.chapterId,
      exams: training.exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        questions: exam.questions.map((question) => ({
          id: question.id,
          type: question.type,
          question: question.question,
          answer: question.answer.formattedValue,
          propositions: question.propositions,
        })),
      })),
    };
  }

  private buildExamsFromPayload(payload: CreateTrainingCommandPayload, trainingId: string): ExamEntityProps[] {
    return payload.exams.map((exam) => {
      const examId = this.uuidGenerator.generate();

      return {
        id: examId,
        trainingId,
        name: exam.name,
        questions: exam.questions.map((question) => ({
          id: this.uuidGenerator.generate(),
          examId,
          type: this.questionsType,
          question: question.question,
          answer: AnswerValueType.createWordListFromValue(question.answer),
          propositions: question.propositions,
        })),
      };
    });
  }
}
