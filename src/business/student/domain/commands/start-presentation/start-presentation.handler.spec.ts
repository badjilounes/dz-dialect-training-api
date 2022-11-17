import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../aggregates/training.aggregate';
import { TrainingCategoryEnum } from '../../enums/training-category.enum';
import { TrainingPresentationNotFoundError } from '../../errors/training-presentation-not-found-error';

import { StartPresentationHandler } from './start-presentation.handler';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Start presentation', () => {
  let handler: StartPresentationHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  let trainingPresentation: TrainingAggregate;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new StartPresentationHandler(
      examCopyCommandRepository,
      trainingCommandRepository,
      uuidGenerator,
      eventPublisher,
    );

    trainingPresentation = TrainingAggregate.from({
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
              type: QuestionTypeEnum.WORD_LIST,
              order: 1,
              question: 'el makla rahi el dekhel',
              examId,
              answer: AnswerValueType.createWordList({ value: ["la nourriture est à l'intérieur"] }),
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

    trainingCommandRepository.findPresentation.mockResolvedValue(trainingPresentation);
  });

  it('should throw if no training presentation exist', async () => {
    trainingCommandRepository.findPresentation.mockResolvedValue(undefined);

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationNotFoundError());
  });

  it('should create a copy for presentation exam', async () => {
    await handler.execute();

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.objectContaining({ examId }));
  });
});
