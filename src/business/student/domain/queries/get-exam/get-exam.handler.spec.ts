import { mock, MockProxy } from 'jest-mock-extended';

import { GetExamQueryHandler } from './get-exam.handler';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';

describe('Get presentation', () => {
  let handler: GetExamQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

  let training: Training;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    trainingQueryRepository.findExamById.mockResolvedValue(undefined);

    handler = new GetExamQueryHandler(trainingQueryRepository);

    training = {
      id: trainingId,
      chapterId: 'chapterId',
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
              type: QuestionTypeEnum.WORD_LIST,
              order: 1,
              question: 'el makla rahi el dekhel',
              answer: ["la nourriture est à l'intérieur"],
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

  it('should throw if no exam exists for given id', async () => {
    await expect(handler.execute({ payload: { examId } })).rejects.toStrictEqual(new ExamNotFoundError(examId));
  });

  it('should return the exam', async () => {
    trainingQueryRepository.findExamById.mockResolvedValue(training.exams[0]);

    const result = await handler.execute({ payload: { examId } });

    expect(result).toEqual({
      id: training.exams[0].id,
      name: training.exams[0].name,
      questions: training.exams[0].questions.map((question) => ({
        id: question.id,
        type: question.type,
        order: question.order,
        question: question.question,
        propositions: question.propositions,
      })),
    });
  });
});
