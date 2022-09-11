import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingExamTypeEnum } from '../../enums/training-exam-type.enum';
import { TrainingCommandRepository } from '../../repositories/training-translation-exam-command-repository';

import { StartPresentationHandler } from './start-presentation.handler';

import { SentenceClientApiService } from '@core/client-api/sentence/sentence-client-api.service';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { SentenceDTO } from '@sentence/api';
import { TrainingAggregate } from 'business/training/domain/aggregates/training.aggregate';

describe('Start presentation', () => {
  let handler: StartPresentationHandler;

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

    handler = new StartPresentationHandler(trainingCommandRepository, uuidGenerator, sentenceApi, eventPublisher);

    sentence = {
      dz: 'el makla rahi el dekhel',
      fr: "la nourriture est à l'intérieur",
      word_propositions: { dz: ['part', 'avec', 'nous'], fr: ['intérieur', 'quelque', 'est'] },
    };
    sentenceApi.getSentences.mockResolvedValue([sentence]);

    training = TrainingAggregate.from({
      id: trainingId,
      name: 'presentation',
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        {
          id: examId,
          trainingId,
          name: 'presentation exam',
          type: TrainingExamTypeEnum.TRANSLATION,
          questions: [
            {
              id: questionId,
              examId,
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

  it('should create a presentation from when no training presentation exist', async () => {
    trainingCommandRepository.findPresentation.mockResolvedValue(undefined);
    uuidGenerator.generate.mockReturnValueOnce(trainingId);
    uuidGenerator.generate.mockReturnValueOnce(examId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);

    const result = await handler.execute();

    expect(result).toEqual({
      id: trainingId,
      name: 'presentation',
      exam: {
        id: examId,
        name: 'presentation exam',
        type: TrainingExamTypeEnum.TRANSLATION,
        questions: [
          {
            id: questionId,
            question: sentence.dz,
            answer: sentence.fr,
            propositions: sentence.word_propositions?.fr,
          },
        ],
      },
    });
  });

  it('should not create again a presentation when a training presentation already exist', async () => {
    trainingCommandRepository.findPresentation.mockResolvedValue(training);

    const result = await handler.execute();

    expect(result).toEqual({
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
    });
  });
});
