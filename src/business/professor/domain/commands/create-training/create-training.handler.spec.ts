import { mock, MockProxy } from 'jest-mock-extended';

import { CreateTrainingHandler } from './create-training.handler';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { CreateTrainingCommandPayload } from '@business/professor/domain/commands/create-training/create-training.command';
import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Create presentation', () => {
  let handler: CreateTrainingHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;

  let payload: CreateTrainingCommandPayload;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new CreateTrainingHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    payload = {
      exams: [
        {
          name: 'presentation exam',
          questions: [
            {
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
    };

    training = TrainingAggregate.from({
      id: trainingId,
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

  it('should create a presentation when no training presentation exist', async () => {
    uuidGenerator.generate.mockReturnValueOnce(trainingId);
    uuidGenerator.generate.mockReturnValueOnce(examId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);

    const result = await handler.execute({ payload });

    expect(result).toEqual({
      id: trainingId,
      chapterId: payload.chapterId,
      exams: [
        {
          id: examId,
          name: payload.exams[0].name,
          questions: [
            {
              id: questionId,
              type: payload.exams[0].questions[0].type,
              question: payload.exams[0].questions[0].question,
              answer: payload.exams[0].questions[0].answer,
              propositions: payload.exams[0].questions[0].propositions,
            },
          ],
        },
      ],
    });
  });
});
