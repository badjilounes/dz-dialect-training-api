import { mock, MockProxy } from 'jest-mock-extended';

import { CreatePresentationHandler } from './create-presentation.handler';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { SentenceDTO } from '@sentence/api';
import { TrainingAggregate } from 'business/training/domain/aggregates/training.aggregate';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { TrainingPresentationAlreadyExistError } from 'business/training/domain/errors/training-presentation-already-exist-error';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

describe('Create presentation', () => {
  let handler: CreatePresentationHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let sentenceApi: MockProxy<SentenceClientApiService>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let sentence: SentenceDTO;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    sentenceApi = mock<SentenceClientApiService>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreatePresentationHandler(trainingCommandRepository, uuidGenerator, sentenceApi, eventPublisher);

    sentence = {
      dz: 'el makla rahi el dekhel',
      fr: "la nourriture est à l'intérieur",
      word_propositions: { dz: ['part', 'avec', 'nous'], fr: ['intérieur', 'quelque', 'est'] },
    };
    sentenceApi.getSentences.mockResolvedValue([sentence]);

    training = TrainingAggregate.from({
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        {
          id: examId,
          trainingId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
              examId,
              type: QuestionTypeEnum.WORD_LIST,
              question: 'el makla rahi el dekhel',
              answer: "la nourriture est à l'intérieur",
              propositions: [
                'part',
                'avec',
                'nous',
                'intérieur',
                'quelque',
                'est',
                'est',
                "l'",
                'nourriture',
                'la',
                'à',
              ],
            },
          ],
        },
      ],
    });
  });

  it('should throw if a training presentation already exist', async () => {
    trainingCommandRepository.findPresentation.mockResolvedValue(training);

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationAlreadyExistError());
  });

  it('should create a presentation from when no training presentation exist', async () => {
    trainingCommandRepository.findPresentation.mockResolvedValue(undefined);
    uuidGenerator.generate.mockReturnValueOnce(trainingId);
    uuidGenerator.generate.mockReturnValueOnce(examId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);

    const result = await handler.execute();

    expect(result).toEqual({
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      exam: {
        id: examId,
        name: 'presentation exam',
        questions: [
          {
            id: questionId,
            type: QuestionTypeEnum.WORD_LIST,
            question: sentence.dz,
            answer: sentence.fr,
            propositions: sentence.word_propositions?.fr,
          },
        ],
      },
    });
  });
});
