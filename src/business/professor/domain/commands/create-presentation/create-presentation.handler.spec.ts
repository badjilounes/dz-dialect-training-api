import { mock, MockProxy } from 'jest-mock-extended';

import { CreatePresentationHandler } from './create-presentation.handler';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/professor/domain/enums/training-category.enum';
import { TrainingPresentationAlreadyExistError } from '@business/professor/domain/errors/training-presentation-already-exist-error';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { SentenceResponseDto } from '@sentence/api';

describe('Create presentation', () => {
  let handler: CreatePresentationHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let sentenceApi: MockProxy<SentenceClientApiService>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let sentence: SentenceResponseDto;

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
      dz_ar: 'المكلة راح الدخل',
      fr: "la nourriture est à l'intérieur",
      word_propositions_dz: ['part', 'avec', 'nous'],
      word_propositions_fr: ['intérieur', 'quelque', 'est'],
      pronouns: ['nous', 'vous', 'ils'],
      verbs: ['part', 'est', 'mange'],
      adjectives: ['quelque', 'intérieur', 'nourriture'],
      tense: 'present',
      schema: 'PVA',
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
              answer: AnswerValueType.createWordListFromValue("la nourriture est à l'intérieur"),
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
            propositions: sentence.word_propositions_fr,
          },
        ],
      },
    });
  });
});
