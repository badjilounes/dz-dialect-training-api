import { Inject } from '@nestjs/common';

import { TrainingExamAggregate } from '../../aggregates/training-exam.aggregate';
import { TrainingAggregate } from '../../aggregates/training.aggregate';
import { TrainingExamTypeEnum } from '../../enums/training-exam-type.enum';
import { TRAINING_COMMAND_REPOSITORY } from '../../repositories/tokens';
import { TrainingCommandRepository } from '../../repositories/training-translation-exam-command-repository';

import { StartPresentationCommand, StartPresentationCommandResult } from './start-presentation.command';

import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR_TOKEN } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(StartPresentationCommand)
export class StartPresentationHandler implements ICommandHandler<StartPresentationCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR_TOKEN)
    private readonly uuidGenerator: UuidGenerator,

    private readonly sentenceApi: SentenceClientApiService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<StartPresentationCommandResult> {
    const existingPresentation = await this.trainingCommandRepository.findPresentation();
    if (existingPresentation) {
      return {
        id: existingPresentation.id,
        name: existingPresentation.name,
        exam: {
          id: existingPresentation.exams[0].id,
          name: existingPresentation.exams[0].name,
          type: existingPresentation.exams[0].type,
          questions: existingPresentation.exams[0].questions.map((question) => ({
            id: question.id,
            question: question.question,
            answer: question.answer,
            propositions: question.propositions,
          })),
        },
      };
    }

    const sentences = await this.sentenceApi.getSentences(10);

    const trainingId = this.uuidGenerator.generate();
    const examId = this.uuidGenerator.generate();

    const training = TrainingAggregate.create({
      id: trainingId,
      name: 'presentation',
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        TrainingExamAggregate.create({
          id: examId,
          trainingId,
          name: 'presentation exam',
          type: TrainingExamTypeEnum.TRANSLATION,
          questions: sentences.map((sentence) => ({
            id: this.uuidGenerator.generate(),
            examId,
            question: sentence.dz || '',
            answer: sentence.fr || '',
            propositions: sentence.word_propositions?.fr || [],
          })),
        }),
      ],
    });

    this.eventPublisher.mergeObjectContext(training);

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      name: training.name,
      exam: {
        id: training.exams[0].id,
        name: training.exams[0].name,
        type: training.exams[0].type,
        questions: training.exams[0].questions.map((question) => ({
          id: question.id,
          question: question.question,
          answer: question.answer,
          propositions: question.propositions,
        })),
      },
    };
  }
}
