import { mock, MockProxy } from 'jest-mock-extended';

import { GetPresentationQueryHandler } from './get-presentation.handler';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { TrainingPresentationNotFoundError } from 'business/training/domain/errors/training-presentation-not-found-error';
import { Training, TrainingQueryRepository } from 'business/training/domain/repositories/training-query-repository';

describe('Get presentation', () => {
  let handler: GetPresentationQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: Training;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    trainingQueryRepository.findPresentation.mockResolvedValue(undefined);

    handler = new GetPresentationQueryHandler(trainingQueryRepository);

    training = {
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
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
  });

  it('should throw if not presentation exists', async () => {
    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationNotFoundError());
  });

  it('should return the presentation', async () => {
    trainingQueryRepository.findPresentation.mockResolvedValue(training);

    const result = await handler.execute();

    expect(result).toEqual({
      id: training.id,
      category: training.category,
      exam: {
        id: training.exams[0].id,
        name: training.exams[0].name,
        questions: training.exams[0].questions.map((question) => ({
          id: question.id,
          type: question.type,
          question: question.question,
          answer: question.answer,
          propositions: question.propositions,
        })),
      },
    });
  });
});
