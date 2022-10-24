import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../aggregates/training.aggregate';
import { TRAINING_COMMAND_REPOSITORY } from '../../repositories/tokens';

import { CreatePresentationCommand, CreatePresentationCommandResult } from './create-presentation.command';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/professor/domain/enums/training-category.enum';
import { TrainingPresentationAlreadyExistError } from '@business/professor/domain/errors/training-presentation-already-exist-error';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreatePresentationCommand)
export class CreatePresentationHandler implements ICommandHandler<CreatePresentationCommand> {
  questionsType: QuestionTypeEnum = QuestionTypeEnum.WORD_LIST;

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
          questions: sentences.map((sentence) => ({
            id: this.uuidGenerator.generate(),
            examId,
            type: this.questionsType,
            question: sentence.dz || '',
            answer: AnswerValueType.createWordListFromValue(sentence.fr || ''),
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
        questions: training.exams[0].questions.map((question) => ({
          id: question.id,
          type: question.type,
          question: question.question,
          answer: question.answer.formattedValue,
          propositions: question.propositions,
        })),
      },
    };
  }
}
