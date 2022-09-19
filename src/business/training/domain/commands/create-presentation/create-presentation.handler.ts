import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../aggregates/training.aggregate';
import { ExamTypeEnum } from '../../enums/exam-type.enum';
import { TRAINING_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { CreatePresentationCommand, CreatePresentationCommandResult } from './create-presentation.command';

import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { TrainingPresentationAlreadyExistError } from 'business/training/domain/errors/training-presentation-already-exist-error';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

@CommandHandler(CreatePresentationCommand)
export class CreatePresentationHandler implements ICommandHandler<CreatePresentationCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly sentenceApi: SentenceClientApiService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<CreatePresentationCommandResult> {
    const existingPresentation = await this.trainingCommandRepository.findPresentation();
    if (existingPresentation) {
      throw new TrainingPresentationAlreadyExistError();
    }

    const sentences = await this.sentenceApi.getSentences(10);

    const trainingId = this.uuidGenerator.generate();
    const examId = this.uuidGenerator.generate();

    const training = TrainingAggregate.create({
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        {
          id: examId,
          trainingId,
          name: 'presentation exam',
          type: ExamTypeEnum.TRANSLATION,
          questions: sentences.map((sentence) => ({
            id: this.uuidGenerator.generate(),
            examId,
            question: sentence.dz || '',
            answer: sentence.fr || '',
            propositions: sentence.word_propositions?.fr || [],
          })),
        },
      ],
    });

    this.eventPublisher.mergeObjectContext(training);

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      category: training.category,
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
